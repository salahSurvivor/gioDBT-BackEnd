import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlotteAdblue } from './entities/flotte-adblue.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class FlotteAdblueService extends BaseCrudService<FlotteAdblue> {
  constructor(@InjectModel(FlotteAdblue.name) private flotteAdblueModel: Model<FlotteAdblue>) {
    super(flotteAdblueModel);
  }
}
