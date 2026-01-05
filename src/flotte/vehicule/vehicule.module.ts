import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { Vehicule, VehiculeSchema } from './entities/vehicule.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicule.name, schema: VehiculeSchema }])],
  providers: [VehiculeService],
  exports: [VehiculeService], // ✅ important pour que GenericController puisse l’injecter
})

export class VehiculeModule {}
