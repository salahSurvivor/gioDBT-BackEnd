import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssuranceCompagnie } from './entities/assurance-compagnie.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class AssuranceCompagnieService extends BaseCrudService<AssuranceCompagnie> {
  constructor(
    @InjectModel(AssuranceCompagnie.name)
    private assuranceCompagnieModel: Model<AssuranceCompagnie>,
  ) {
    super(assuranceCompagnieModel);
  }
}
