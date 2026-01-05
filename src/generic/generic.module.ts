import { Module } from '@nestjs/common';
import { GenericController } from './generic.controller';
import { VehiculeModule } from '../flotte/vehicule/vehicule.module';
import { VehiculeMarqueModule } from '../flotte/vehicule-marque/vehicule-marque.module';
import { VehiculeModeleModule } from '../flotte/vehicule-modele/vehicule-modele.module';
import { VehiculeCarburantModule } from '../flotte/vehicule-carburant/vehicule-carburant.module';

@Module({
  imports: [  
    VehiculeModule, 
    VehiculeMarqueModule, 
    VehiculeModeleModule, 
    VehiculeCarburantModule
  ],
  controllers: [GenericController], // ✅ seulement ici
})
export class GenericModule {}