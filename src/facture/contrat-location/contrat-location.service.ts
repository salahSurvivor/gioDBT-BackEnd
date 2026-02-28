import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from 'src/common/base-crud.service';
import { ContratLocation } from './entities/contrat-location.entity';

@Injectable()
export class ContratLocationService extends BaseCrudService<ContratLocation> {
  constructor(
    @InjectModel(ContratLocation.name)
    private contratLocationModel: Model<ContratLocation>,
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
}
