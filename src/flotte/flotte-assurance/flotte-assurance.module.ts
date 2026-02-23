import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlotteAssuranceService } from './flotte-assurance.service';
import {
  FlotteAssurance,
  FlotteAssuranceSchema,
} from './entities/flotte-assurance.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlotteAssurance.name, schema: FlotteAssuranceSchema },
    ]),
  ],
  providers: [FlotteAssuranceService],
  exports: [FlotteAssuranceService],
})
export class FlotteAssuranceModule {}
