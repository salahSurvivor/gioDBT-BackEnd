import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RhClientService } from './rh-client.service';
import { Client, ClientSchema } from './entities/rh-client.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  providers: [RhClientService],
  exports: [RhClientService],
})
export class RhClientModule {}
