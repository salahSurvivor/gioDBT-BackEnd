import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlotteAdblueService } from './flotte-adblue.service';
import { FlotteAdblue, FlotteAdblueSchema } from './entities/flotte-adblue.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlotteAdblue.name, schema: FlotteAdblueSchema }])],
  providers: [FlotteAdblueService],
  exports: [FlotteAdblueService],
})
export class FlotteAdblueModule {}
