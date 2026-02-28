import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactureClientService } from './facture-client.service';
import { FactureClientController } from './facture-client.controller';
import { FactureClient, FactureClientSchema } from './entities/facture-client.entity';
import { ContratLocation, ContratLocationSchema } from '../contrat-location/entities/contrat-location.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FactureClient.name, schema: FactureClientSchema },
      { name: ContratLocation.name, schema: ContratLocationSchema },
    ]),
  ],
  controllers: [FactureClientController],
  providers: [FactureClientService],
  exports: [FactureClientService],
})
export class FactureClientModule {}
