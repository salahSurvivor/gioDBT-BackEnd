import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RhPosteService } from './rh-poste.service';
import { RhPoste, RhPosteSchema } from './entities/rh-poste.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: RhPoste.name, schema: RhPosteSchema }])],
  providers: [RhPosteService],
  exports: [RhPosteService],
})
export class RhPosteModule {}
