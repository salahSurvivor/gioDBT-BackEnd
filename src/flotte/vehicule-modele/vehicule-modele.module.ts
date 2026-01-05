import { Module } from '@nestjs/common';
import { VehiculeModeleService } from './vehicule-modele.service';
import { VehiculeModele, VehiculeModeleSchema } from './entities/vehicule-modele.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: VehiculeModele.name, schema: VehiculeModeleSchema }])],
  providers: [VehiculeModeleService],
  exports: [VehiculeModeleService], // ✅ important pour que GenericController puisse l’injecter
})

export class VehiculeModeleModule {}
