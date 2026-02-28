import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { VehiculeModule } from './flotte/vehicule/vehicule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenericModule } from './generic/generic.module';
import { VehiculeMarqueModule } from './flotte/vehicule-marque/vehicule-marque.module';
import { VehiculeModeleModule } from './flotte/vehicule-modele/vehicule-modele.module';
import { VehiculeCarburantModule } from './flotte/vehicule-carburant/vehicule-carburant.module';
import { FlotteAssuranceModule } from './flotte/flotte-assurance/flotte-assurance.module';
import { FlotteAdblueModule } from './flotte/flotte-adblue/flotte-adblue.module';
import { FlotteVignetteModule } from './flotte/flotte-vignette/flotte-vignette.module';
import { AssuranceCompagnieModule } from './flotte/assurance-compagnie/assurance-compagnie.module';
import { AssuranceTypeModule } from './flotte/assurance-type/assurance-type.module';
import { RhClientModule } from './RH/rh-client/rh-client.module';
import { ContratLocationModule } from './facture/contrat-location/contrat-location.module';
import { FactureClientModule } from './facture/facture-client/facture-client.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/geoApp'),
    AuthModule,
    ProfileModule,
    GenericModule,
    VehiculeModule,
    VehiculeMarqueModule,
    VehiculeModeleModule,
    VehiculeCarburantModule,
    FlotteAssuranceModule,
    FlotteAdblueModule,
    FlotteVignetteModule,
    AssuranceCompagnieModule,
    AssuranceTypeModule,
    RhClientModule,
    ContratLocationModule,
    FactureClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
