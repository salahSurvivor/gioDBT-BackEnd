import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from 'src/common/base-crud.service';
import { FactureClient } from './entities/facture-client.entity';
import { ContratLocation } from '../contrat-location/entities/contrat-location.entity';

@Injectable()
export class FactureClientService extends BaseCrudService<FactureClient> {
  constructor(
    @InjectModel(FactureClient.name)
    private factureClientModel: Model<FactureClient>,
    @InjectModel(ContratLocation.name)
    private contratLocationModel: Model<ContratLocation>,
  ) {
    super(factureClientModel);
  }

  async generateFromLocation(dto: any, authCode: string) {
    const locationId = dto?.locationId;
    if (!locationId) throw new NotFoundException('locationId is required');

    const location = await this.contratLocationModel.findOne({ _id: locationId, authCode }).lean();
    if (!location) throw new NotFoundException('Contrat not found');

    const debut = new Date(location.dateDebut);
    const fin = new Date(location.dateFin);
    const dayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.max(1, Math.ceil((fin.getTime() - debut.getTime()) / dayMs) + 1);

    const pu = Number(location.prixParJour || 0);
    const lineTotal = diffDays * pu;
    const tva = Number(dto?.TVA ?? 20);
    const totalHT = lineTotal;
    const totalTTC = totalHT + (totalHT * tva) / 100;

    const invoice = {
      invoiceNumber: dto?.invoiceNumber || `FC-${Date.now()}`,
      clientId: location.clientId,
      locationId: location._id,
      vehiculeId: location.vehiculeId,
      dateFacture: dto?.dateFacture ? new Date(dto.dateFacture) : new Date(),
      lignes: dto?.lignes?.length
        ? dto.lignes
        : [{ designation: 'Location vehicule', qte: diffDays, pu, total: lineTotal }],
      totalHT,
      TVA: tva,
      totalTTC,
      statutPaiement: dto?.statutPaiement || 'EN_ATTENTE',
      authCode,
    };

    const created = new this.factureClientModel(invoice);
    return created.save();
  }
}
