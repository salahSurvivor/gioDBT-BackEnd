import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlotteVignetteService } from './flotte-vignette.service';
import { FlotteVignette, FlotteVignetteSchema } from './entities/flotte-vignette.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlotteVignette.name, schema: FlotteVignetteSchema }])],
  providers: [FlotteVignetteService],
  exports: [FlotteVignetteService],
})
export class FlotteVignetteModule {}
