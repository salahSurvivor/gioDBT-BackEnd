import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContratLocationService } from './contrat-location.service';
import { ContratLocationController } from './contrat-location.controller';
import { ContratLocation, ContratLocationSchema } from './entities/contrat-location.entity';
import { Entreprise, EntrepriseSchema } from 'src/auth/entities/entreprises.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContratLocation.name, schema: ContratLocationSchema },
      { name: Entreprise.name, schema: EntrepriseSchema },
    ]),
  ],
  controllers: [ContratLocationController],
  providers: [ContratLocationService],
  exports: [ContratLocationService],
})
export class ContratLocationModule {}
