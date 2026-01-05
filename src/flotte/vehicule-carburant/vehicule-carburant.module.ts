import { Module } from '@nestjs/common';
import { VehiculeCarburantService } from './vehicule-carburant.service';
import { VehiculeCarburant, VehiculeCarburantSchema } from './entities/vehicule-carburant.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: VehiculeCarburant.name, schema: VehiculeCarburantSchema }])],
  providers: [VehiculeCarburantService],
  exports: [VehiculeCarburantService], // ✅ important pour que GenericController puisse l’injecter
})

export class VehiculeCarburantModule {}