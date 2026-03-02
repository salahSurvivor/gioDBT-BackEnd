import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from 'src/common/base-crud.service';
import { ContratLocation } from './entities/contrat-location.entity';
import { Entreprise } from 'src/auth/entities/entreprises.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContratLocationService extends BaseCrudService<ContratLocation> {
  constructor(
    @InjectModel(ContratLocation.name)
    private contratLocationModel: Model<ContratLocation>,
    @InjectModel(Entreprise.name)
    private entrepriseModel: Model<Entreprise>,
  ) {
    super(contratLocationModel);
  }

  async create(createDto: any): Promise<ContratLocation> {
    const authCode = createDto?.authCode || '';

    const records = await this.contratLocationModel.find({ authCode }).select('numero').lean();
    const maxNumero = records.reduce((max, item: any) => {
      const raw = item?.numero;
      if (typeof raw === 'number') return Math.max(max, raw);
      if (typeof raw === 'string') {
        const value = raw.startsWith('CNT-') ? Number(raw.split('-')[1]) : Number(raw);
        if (Number.isFinite(value)) return Math.max(max, value);
      }
      return max;
    }, 0);

    const nextNumero = maxNumero + 1;
    const payload = { ...createDto, numero: `CNT-${nextNumero}` };

    const created = new this.contratLocationModel(payload);
    return created.save();
  }

  private getStatutByDates(dateDebut: any, dateFin: any): 'EN_COURS' | 'TERMINE' {
    if (!dateDebut || !dateFin) return 'TERMINE';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) return 'TERMINE';

    debut.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999);
    return today >= debut && today <= fin ? 'EN_COURS' : 'TERMINE';
  }

  private async syncContratStatuses(authCode: string): Promise<void> {
    if (!authCode) return;

    const contrats = await this.contratLocationModel
      .find({ authCode, statut: { $ne: 'ANNULE' } })
      .select('_id dateDebut dateFin statut')
      .lean();

    if (!contrats?.length) return;

    const operations = contrats
      .map((c: any) => {
        const expectedStatut = this.getStatutByDates(c?.dateDebut, c?.dateFin);
        if (c?.statut === expectedStatut) return null;
        return {
          updateOne: {
            filter: { _id: c._id },
            update: { $set: { statut: expectedStatut } },
          },
        };
      })
      .filter(Boolean) as any[];

    if (!operations.length) return;
    await this.contratLocationModel.bulkWrite(operations);
  }

  async find(query: any, dto: any): Promise<any> {
    await this.syncContratStatuses(query?.authCode || '');
    return super.find(query, dto);
  }

  async findAll(query: any): Promise<any> {
    await this.syncContratStatuses(query?.authCode || '');
    return super.findAll(query);
  }

  async checkVehiculeAvailability(dto: any, authCode: string) {
    const vehiculeId = dto?.vehiculeId;
    const currentId = dto?.currentId;
    const statut = dto?.statut;

    if (!vehiculeId) return { available: false, reason: 'VEHICULE_REQUIRED' };
    if (statut !== 'EN_COURS') return { available: true, reason: null };

    const dateDebut = new Date(dto?.dateDebut);
    const dateFin = new Date(dto?.dateFin);
    if (Number.isNaN(dateDebut.getTime()) || Number.isNaN(dateFin.getTime())) {
      return { available: false, reason: 'DATE_INVALID' };
    }

    const query: any = {
      vehiculeId,
      authCode,
      statut: 'EN_COURS',
      dateDebut: { $lte: dateFin },
      dateFin: { $gte: dateDebut },
    };

    if (currentId) query._id = { $ne: currentId };

    const conflict = await this.contratLocationModel.exists(query);
    return {
      available: !conflict,
      reason: conflict ? 'VEHICULE_ALREADY_RENTED' : null,
    };
  }

  private getLogoDataUri(): string {
    const candidates = [
      path.resolve(process.cwd(), '../front-end/public/img/logo.png'),
      path.resolve(process.cwd(), '../front-end/dist/front-end/browser/img/logo.png'),
      path.resolve(process.cwd(), 'public/img/logo.png'),
    ];

    for (const filePath of candidates) {
      if (!fs.existsSync(filePath)) continue;
      const base64 = fs.readFileSync(filePath).toString('base64');
      return `data:image/png;base64,${base64}`;
    }

    return '';
  }

  private formatDate(value: any): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR');
  }

  private escapeHtml(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private buildContractHtml(contrat: any, entreprise: any): string {
    const client = contrat?.clientId || {};
    const vehicule = contrat?.vehiculeId || {};
    const logoDataUri = this.getLogoDataUri();
    const companyName = entreprise?.entrepriseNom || 'DRIVE MOBILITY';
    const companyAddress = entreprise?.adresse || '-';
    const companyPhone = entreprise?.telephone || '-';
    const companyEmail = entreprise?.email || '-';
    const companyNameEsc = this.escapeHtml(companyName);
    const companyAddressEsc = this.escapeHtml(companyAddress);
    const companyPhoneEsc = this.escapeHtml(companyPhone);
    const companyEmailEsc = this.escapeHtml(companyEmail);

    const clientNom =
      client?.raisonSociale ||
      `${client?.nom || ''} ${client?.prenom || ''}`.trim() ||
      '-';

    const today = this.formatDate(new Date());
    const nombreJours =
      contrat?.dateDebut && contrat?.dateFin
        ? Math.max(
            1,
            Math.ceil(
              (new Date(contrat.dateFin).getTime() - new Date(contrat.dateDebut).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1,
          )
        : '-';
    const totalEstime =
      typeof contrat?.prixParJour === 'number' && typeof nombreJours === 'number'
        ? contrat.prixParJour * nombreJours
        : null;

    return `
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Contrat de location ${this.escapeHtml(contrat?.numero || '')}</title>
  <style>
    @page { size: A4; margin: 24mm 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; color:#1f2937; font-size:12px; line-height:1.45; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #14532d; padding-bottom:12px; margin-bottom:20px; }
    .brand { display:flex; gap:12px; align-items:center; }
    .brand img { width:64px; height:64px; object-fit:contain; }
    .brand-title { font-size:20px; font-weight:700; color:#14532d; margin:0; }
    .brand-sub { margin:2px 0 0; color:#4b5563; font-size:11px; }
    .meta { text-align:right; font-size:11px; color:#4b5563; }
    .title { font-size:18px; font-weight:700; margin:0 0 8px; color:#111827; }
    .subtitle { margin:0 0 20px; color:#374151; }
    .section { margin-bottom:16px; }
    .section h3 { margin:0 0 8px; font-size:13px; color:#14532d; text-transform:uppercase; letter-spacing:.3px; }
    .card { border:1px solid #d1d5db; border-radius:8px; padding:10px 12px; background:#f9fafb; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .item-label { font-size:11px; color:#6b7280; }
    .item-value { font-weight:600; color:#111827; margin-top:2px; }
    .terms { border:1px solid #d1d5db; border-radius:8px; padding:12px; }
    .terms h4 { margin:12px 0 6px; font-size:12px; color:#14532d; text-transform:uppercase; }
    .terms p { margin:0 0 8px; }
    .terms ul { margin:0 0 8px 16px; padding:0; }
    .terms li { margin:0 0 6px; }
    .signatures { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:26px; }
    .sig-box { border-top:1px solid #6b7280; padding-top:8px; text-align:center; color:#374151; font-weight:600; }
    .footer { margin-top:20px; font-size:10px; color:#6b7280; text-align:center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      ${logoDataUri ? `<img src="${logoDataUri}" alt="Logo" />` : ''}
      <div>
        <p class="brand-title">Contrat de Location</p>
        <p class="brand-sub">Document contractuel de mise a disposition de vehicule - ${companyNameEsc}</p>
      </div>
    </div>
    <div class="meta">
      <div><strong>N° Contrat:</strong> ${this.escapeHtml(contrat?.numero || '-')}</div>
      <div><strong>Date edition:</strong> ${this.escapeHtml(today)}</div>
      <div><strong>Statut:</strong> ${this.escapeHtml(contrat?.statut || '-')}</div>
    </div>
  </div>

  <h1 class="title">Contrat de location de vehicule</h1>
  <p class="subtitle">Entre la societe et le client ci-dessous, les conditions suivantes sont appliquees.</p>

  <div class="section">
    <h3>Informations client</h3>
    <div class="card grid">
      <div><div class="item-label">Client</div><div class="item-value">${this.escapeHtml(clientNom)}</div></div>
      <div><div class="item-label">CIN / ICE</div><div class="item-value">${this.escapeHtml(client?.cinIce || '-')}</div></div>
      <div><div class="item-label">Telephone</div><div class="item-value">${this.escapeHtml(client?.telephone || '-')}</div></div>
      <div><div class="item-label">Email</div><div class="item-value">${this.escapeHtml(client?.email || '-')}</div></div>
      <div style="grid-column: 1 / -1;"><div class="item-label">Adresse</div><div class="item-value">${this.escapeHtml(client?.adresse || '-')}</div></div>
    </div>
  </div>

  <div class="section">
    <h3>Informations vehicule</h3>
    <div class="card grid">
      <div><div class="item-label">Immatriculation</div><div class="item-value">${this.escapeHtml(vehicule?.immatriculation || '-')}</div></div>
      <div><div class="item-label">Numero de chassis</div><div class="item-value">${this.escapeHtml(vehicule?.numeroChassis || '-')}</div></div>
      <div><div class="item-label">Marque</div><div class="item-value">${this.escapeHtml(vehicule?.vehiculeMarqueId?.nom || '-')}</div></div>
      <div><div class="item-label">Modele</div><div class="item-value">${this.escapeHtml(vehicule?.vehiculeModeleId?.nom || '-')}</div></div>
      <div><div class="item-label">Carburant</div><div class="item-value">${this.escapeHtml(vehicule?.vehiculeCarburantId?.nom || '-')}</div></div>
      <div><div class="item-label">Annee</div><div class="item-value">${this.escapeHtml(vehicule?.annee ?? '-')}</div></div>
    </div>
  </div>

  <div class="section">
    <h3>Conditions de location</h3>
    <div class="card grid">
      <div><div class="item-label">Date debut</div><div class="item-value">${this.escapeHtml(this.formatDate(contrat?.dateDebut))}</div></div>
      <div><div class="item-label">Date fin</div><div class="item-value">${this.escapeHtml(this.formatDate(contrat?.dateFin))}</div></div>
      <div><div class="item-label">Prix par jour</div><div class="item-value">${this.escapeHtml(contrat?.prixParJour ?? 0)} DH</div></div>
      <div><div class="item-label">Caution</div><div class="item-value">${this.escapeHtml(contrat?.caution ?? 0)} DH</div></div>
      <div><div class="item-label">KM debut</div><div class="item-value">${this.escapeHtml(contrat?.kmDebut ?? '-')}</div></div>
      <div><div class="item-label">KM fin</div><div class="item-value">${this.escapeHtml(contrat?.kmFin ?? '-')}</div></div>
      <div><div class="item-label">Duree estimee</div><div class="item-value">${this.escapeHtml(nombreJours)} jour(s)</div></div>
      <div><div class="item-label">Montant estime</div><div class="item-value">${this.escapeHtml(totalEstime ?? '-')} ${totalEstime !== null ? 'DH' : ''}</div></div>
    </div>
  </div>

  <div class="section">
    <h3>Conditions Generales</h3>
    <div class="terms">
      <h4>ARTICLE 1 : L'etat du vehicule - Usage. Reparation</h4>
      <p>a. Le client declare avoir visite minutieusement le vehicule et constate son bon etat de marche, sa proprete. Le client s'engage a rendre le vehicule bien lave de l'exterieur et de l'interieur sinon il doit payer les frais de lavage.</p>
      <p>b. Le client declare avoir constate que les cinq pneus equipant le vehicule sont en bon etat, sans coupure et que leur usure est normale. En cas de deterioration de l'un d'entre eux pour une cause autre que l'usure normale, le client s'engage a le remplacer immediatement par un pneu de meme dimension et marque du vehicule loue.</p>
      <p>c. Le probleme mecanique normal est a la charge de ${companyNameEsc}. Toute reparation provenant d'un probleme anormal ou de la negligence du client est a la charge du client. Les degats causes aux organes mecaniques situes au-dessous du vehicule (carter d'huile, traverses, barres et bras de direction, tuyaux d'echappement, etc.) sont supportes par le client.</p>
      <p>d. Le client ne pourra reclamer a ${companyNameEsc} des dommages et interets qu'il s'agisse d'un retard de remise de vehicule, d'annulation ou de reparations dues a un probleme anormal survenu en cours de location.</p>
      <p>e. La responsabilite de ${companyNameEsc} ne pourra etre invoquee meme en cas d'accident corporel ou materiel resultant d'un vice, de defauts de fabrication ou de reparations anterieures.</p>
      <p>f. Le client s'interdit formellement de quitter le territoire marocain a bord du vehicule loue sans autorisation ecrite de ${companyNameEsc}.</p>
      <p>g. Le vehicule loue ne peut pas etre destine aux usages suivants :</p>
      <ul>
        <li>Transport de marchandises, notamment celles en violation des lois et reglements en vigueur (stupefiants, alcool, etc.).</li>
        <li>Transport de passagers a but lucratif.</li>
        <li>Remorquage ou depannage de tout vehicule.</li>
        <li>Competitions sportives, rallyes, reconnaissances de circuit.</li>
        <li>Terrains non conformes a la nature et a la resistance du vehicule loue.</li>
      </ul>
      <p>Au cas de confiscation par la Douane ou Regie de Tabacs, le client s'engage a regler : le montant du a la date de confiscation, le prix du vehicule selon l'argus en vigueur, tous les frais de procedure engages contre lui et tous les interets de retard en cas de non-paiement.</p>

      <h4>ARTICLE 2 : Assurance - Accident</h4>
      <p>a. Le client a bien note qu'il etait garanti suivant les conditions generales des polices d'assurance contractees par ${companyNameEsc} et declare en avoir pris connaissance.</p>
      <p>b. Le vehicule est assure contre le vol, l'incendie, la responsabilite civile, personnes transportees, defense et recours, dommage collision avec une franchise de 10% sur la valeur d'achat a neuf. Le poste radio, le telephone, les accessoires, vetements ou objets restes dans le vehicule restent sous la responsabilite du client.</p>
      <p>c. En cas d'accident, le client devra payer a ${companyNameEsc} la franchise de 10% sur la valeur d'achat a neuf ainsi que la location jusqu'a la reparation. Le client doit declarer immediatement tout accident, vol ou incendie, fournir un constat amiable cachete (assistance/police/gendarmerie), prendre des photos sur le lieu de l'accident et ne pas discuter la responsabilite avec les tiers.</p>
      <p>Le nombre de personnes transportees ne doit jamais depasser celui autorise par la police d'assurance du vehicule.</p>
      <p>d. La responsabilite du locataire ne sera pas degagee en cas d'accident cause par sa faute et il supportera la totalite des dommages causes au vehicule. S'il n'est pas fautif, il supportera l'immobilisation (maximum 60 jours) de la valeur locative.</p>

      <h4>ARTICLE 3 : Location - Pre Paiement - Prolongation</h4>
      <p>a. Le montant de location est payable d'avance.</p>
      <p>b. La journee de location commence a partir de l'heure de prise du vehicule. Toute journee commencee est due. En cas de prolongation, le client doit obtenir l'accord express et ecrit de ${companyNameEsc} et regler la location supplementaire, sinon restituer le vehicule.</p>
      <p>${companyNameEsc} - Adresse : ${companyAddressEsc}. Tel : ${companyPhoneEsc}. Email : ${companyEmailEsc}.</p>
      <p>Si le client ne restitue pas le vehicule dans un delai de 48 heures, il sera considere comme l'ayant detourne et sera passible de poursuites penales pour vol, abus de confiance et usage contre la volonte de ${companyNameEsc}, conformement aux articles 505 et 547 du code penal marocain.</p>
      <p>${companyNameEsc} se reserve le droit de recuperer son vehicule sans preavis en faisant appel a un huissier de justice. Le seul moyen d'avis valable est l'email ou la lettre recommandee avec accuse de reception.</p>
      <p>c. La restitution du vehicule loue sera effectuee au bureau de ${companyNameEsc}. En cas de litige, le locataire supportera tous les frais judiciaires, d'enregistrement, amendes, taxes et droits exposes par ${companyNameEsc}.</p>

      <h4>ARTICLE 4 : Documents du Vehicule & Cles</h4>
      <p>a. Le client doit restituer avec le vehicule la carte grise et tous les documents necessaires a la circulation. A defaut, la location continue a etre facturee jusqu'a recuperation des pieces ou etablissement de duplicatas, aussi factures au client.</p>
      <p>En cas de perte de la cle de demarrage, le loueur doit signer un engagement et payer les frais de duplication de la nouvelle cle.</p>
      <p>b. Le client s'engage a ne laisser conduire le vehicule qu'a lui-meme ou a toute personne habilitee par ${companyNameEsc} par ecrit et assume sa pleine responsabilite en cas de pret a un tiers.</p>

      <h4>ARTICLE 5 : Remboursement</h4>
      <p>Le client s'engage a n'exiger aucun remboursement pour une duree de location non consommee.</p>

      <h4>ARTICLE 6 : Reparation de la Voiture par le Client</h4>
      <p>Le client s'engage a n'effectuer aucune reparation sur le vehicule loue, sauf apres accord ecrit de ${companyNameEsc}.</p>

      <h4>ARTICLE 7 : Autres Conditions Complementaires</h4>
      <p>Le client s'engage a signer le bon de restitution du vehicule, le bon de recette en cas de versement et le contrat a la prise du vehicule.</p>
      <p>En cas de non-respect de l'une des clauses, ${companyNameEsc} se reserve le droit de retirer le vehicule sans preavis. En cas de contestation, ${companyNameEsc} peut saisir les tribunaux de Rabat ou ceux de la residence du client.</p>

      <h4>ARTICLE 8 : Contraventions</h4>
      <p>Le locataire reconnait sa responsabilite pour toute contravention constatee automatiquement par radar.</p>

      <h4>ARTICLE 9 : GPS</h4>
      <p>Tous nos vehicules sont equipes d'un traceur GPS pour identifier la voiture en cas d'accident et assurer le suivi de l'entretien.</p>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-box">Signature de ${companyNameEsc}</div>
    <div class="sig-box">Signature du client</div>
  </div>

  <div class="footer">
    Contrat genere automatiquement le ${this.escapeHtml(today)}.
  </div>
</body>
</html>
    `;
  }

  async generateContratPdf(id: string, authCode: string): Promise<Buffer> {
    const contrat = await this.contratLocationModel
      .findOne({ _id: id, authCode })
      .populate('clientId')
      .populate({
        path: 'vehiculeId',
        populate: [{ path: 'vehiculeMarqueId' }, { path: 'vehiculeModeleId' }, { path: 'vehiculeCarburantId' }],
      })
      .lean();

    if (!contrat) {
      throw new NotFoundException('Contrat introuvable');
    }

    const entreprise = await this.entrepriseModel.findOne({ authCode }).lean();
    const html = this.buildContractHtml(contrat, entreprise);
    const puppeteer = await Function('return import("puppeteer")')();
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      return await page.pdf({
        format: 'A4',
        printBackground: true,
      });
    } finally {
      await browser.close();
    }
  }
}
