import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlotteAssurance } from './entities/flotte-assurance.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class FlotteAssuranceService extends BaseCrudService<FlotteAssurance> {
  constructor(
    @InjectModel(FlotteAssurance.name)
    private flotteAssuranceModel: Model<FlotteAssurance>,
  ) {
    super(flotteAssuranceModel);
  }

  private async syncEtatFromDates(authCode?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const baseFilter: any = { etat: { $ne: 'Resiliee' } };
    if (authCode) {
      baseFilter.authCode = authCode;
    }

    await this.flotteAssuranceModel.updateMany(
      {
        ...baseFilter,
        dateDebut: { $lte: today },
        dateFin: { $gte: today },
      },
      { $set: { etat: 'Active' } },
    );

    await this.flotteAssuranceModel.updateMany(
      {
        ...baseFilter,
        $or: [
          { dateDebut: { $exists: false } },
          { dateDebut: null },
          { dateFin: { $exists: false } },
          { dateFin: null },
          { dateDebut: { $gt: today } },
          { dateFin: { $lt: today } },
        ],
      },
      { $set: { etat: 'Expiree' } },
    );
  }

  async find(query: any, dto: any): Promise<any> {
    await this.syncEtatFromDates(query?.authCode);
    return super.find(query, dto);
  }

  async findAll(query: any): Promise<FlotteAssurance[]> {
    await this.syncEtatFromDates(query?.authCode);
    return super.findAll(query);
  }
}
