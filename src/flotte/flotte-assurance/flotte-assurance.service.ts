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
}
