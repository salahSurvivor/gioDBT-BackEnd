import { Module } from '@nestjs/common';
import { RhCollaborateurService } from './rh-collaborateur.service';
import { Collaborateur, CollaborateurSchema } from './entities/rh-collaborateur.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Collaborateur.name, schema: CollaborateurSchema }])],
  providers: [RhCollaborateurService],
  exports: [RhCollaborateurService], // ✅ important pour que GenericController puisse l’injecter
})

export class RhCollaborateurModule {}
