import { Module } from '@nestjs/common';
import { GenericController } from './generic.controller';
//--------------------------Flotte section---------------------------
import { VehiculeModule } from '../flotte/vehicule/vehicule.module';
import { VehiculeMarqueModule } from '../flotte/vehicule-marque/vehicule-marque.module';
import { VehiculeModeleModule } from '../flotte/vehicule-modele/vehicule-modele.module';
import { VehiculeCarburantModule } from '../flotte/vehicule-carburant/vehicule-carburant.module';
import { FlotteAffectationModule } from '../flotte/flotte-affectation/flotte-affectation.module';
import { FlotteAssuranceModule } from '../flotte/flotte-assurance/flotte-assurance.module';
import { FlotteAdblueModule } from '../flotte/flotte-adblue/flotte-adblue.module';
import { AssuranceCompagnieModule } from '../flotte/assurance-compagnie/assurance-compagnie.module';
import { AssuranceTypeModule } from '../flotte/assurance-type/assurance-type.module';

//--------------------------RH Section-----------------------------
import { RhCollaborateurModule } from '../RH/rh-collaborateur/rh-collaborateur.module';

@Module({
  imports: [
    VehiculeModule,
    VehiculeMarqueModule,
    VehiculeModeleModule,
    VehiculeCarburantModule,
    FlotteAffectationModule,
    FlotteAssuranceModule,
    FlotteAdblueModule,
    AssuranceCompagnieModule,
    AssuranceTypeModule,
    RhCollaborateurModule,
  ],
  controllers: [GenericController],
})
export class GenericModule {}
