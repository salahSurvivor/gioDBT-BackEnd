import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssuranceType } from './entities/assurance-type.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class AssuranceTypeService extends BaseCrudService<AssuranceType> {
  constructor(
    @InjectModel(AssuranceType.name)
    private assuranceTypeModel: Model<AssuranceType>,
  ) {
    super(assuranceTypeModel);
  }
}
