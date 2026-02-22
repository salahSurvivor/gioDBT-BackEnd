import { Module } from '@nestjs/common';
import { GenericController } from './generic.controller';
//--------------------------Flotte section---------------------------
import { VehiculeModule } from '../flotte/vehicule/vehicule.module';
import { VehiculeMarqueModule } from '../flotte/vehicule-marque/vehicule-marque.module';
import { VehiculeModeleModule } from '../flotte/vehicule-modele/vehicule-modele.module';
import { VehiculeCarburantModule } from '../flotte/vehicule-carburant/vehicule-carburant.module';
import { FlotteAffectationModule } from '../flotte/flotte-affectation/flotte-affectation.module';

//--------------------------RH Section-----------------------------
import { RhCollaborateurModule } from '../RH/rh-collaborateur/rh-collaborateur.module';

@Module({
  imports: [  
    VehiculeModule, 
    VehiculeMarqueModule, 
    VehiculeModeleModule, 
    VehiculeCarburantModule,
    RhCollaborateurModule,
    FlotteAffectationModule
  ],
  controllers: [GenericController], // ✅ seulement ici
})
export class GenericModule {}