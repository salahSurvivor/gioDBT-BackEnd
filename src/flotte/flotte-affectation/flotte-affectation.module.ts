import { Module } from '@nestjs/common';
import { FlotteAffectationService } from './flotte-affectation.service';
import {
  FlotteAffectation,
  FlotteAffectationSchema,
} from './entities/flotte-affectation.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { FlotteAffectationController } from './flotte-affectation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlotteAffectation.name, schema: FlotteAffectationSchema },
    ]),
  ],
  controllers: [FlotteAffectationController],
  providers: [FlotteAffectationService],
  exports: [FlotteAffectationService],
})
export class FlotteAffectationModule {}
