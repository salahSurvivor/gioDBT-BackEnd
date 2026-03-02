import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RhPoste } from './entities/rh-poste.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class RhPosteService extends BaseCrudService<RhPoste> {
  constructor(@InjectModel(RhPoste.name) private rhPosteModel: Model<RhPoste>) {
    super(rhPosteModel);
  }
}
