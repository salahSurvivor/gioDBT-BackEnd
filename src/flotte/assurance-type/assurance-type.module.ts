import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssuranceTypeService } from './assurance-type.service';
import { AssuranceType, AssuranceTypeSchema } from './entities/assurance-type.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: AssuranceType.name, schema: AssuranceTypeSchema }])],
  providers: [AssuranceTypeService],
  exports: [AssuranceTypeService],
})
export class AssuranceTypeModule {}
