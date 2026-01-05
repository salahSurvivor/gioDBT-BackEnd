import { Module } from '@nestjs/common';
import { VehiculeMarqueService } from './vehicule-marque.service';
import { VehiculeMarque, VehiculeMarqueSchema } from './entities/vehicule-marque.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: VehiculeMarque.name, schema: VehiculeMarqueSchema }])],
  providers: [VehiculeMarqueService],
  exports: [VehiculeMarqueService], // ✅ important pour que GenericController puisse l’injecter
})

export class VehiculeMarqueModule {}
