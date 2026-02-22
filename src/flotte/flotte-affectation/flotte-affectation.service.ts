import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlotteAffectation } from './entities/flotte-affectation.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class FlotteAffectationService extends BaseCrudService<FlotteAffectation> {
  constructor(
    @InjectModel(FlotteAffectation.name)
    private flotteAffectationModel: Model<FlotteAffectation>,
  ) {
    super(flotteAffectationModel);
  }

  async checkVehiculeAvailability(dto: any, authCode: string) {
    const vehiculeId = dto?.vehiculeId;
    const currentId = dto?.currentId;

    if (!vehiculeId) {
      return { available: false, reason: 'VEHICULE_REQUIRED' };
    }

    const dateDebut = new Date(dto?.dateDebut);
    if (Number.isNaN(dateDebut.getTime())) {
      return { available: false, reason: 'DATE_DEBUT_INVALID' };
    }

    const hasDateFin =
      dto?.dateFin !== null && dto?.dateFin !== undefined && dto?.dateFin !== '';
    const dateFin = hasDateFin ? new Date(dto.dateFin) : null;

    if (hasDateFin && dateFin && Number.isNaN(dateFin.getTime())) {
      return { available: false, reason: 'DATE_FIN_INVALID' };
    }

    const query: any = {
      vehiculeId,
      authCode,
      $or: [{ dateFin: null }, { dateFin: { $gte: dateDebut } }],
    };

    if (dateFin) {
      query.dateDebut = { $lte: dateFin };
    }

    if (currentId) {
      query._id = { $ne: currentId };
    }

    const conflict = await this.flotteAffectationModel.exists(query);

    return {
      available: !conflict,
      reason: conflict ? 'VEHICULE_ALREADY_ASSIGNED' : null,
    };
  }
}
