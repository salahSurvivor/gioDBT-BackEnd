import { Module } from '@nestjs/common';
import { RhCollaborateurService } from './rh-collaborateur.service';
import { Collaborateur, CollaborateurSchema } from './entities/rh-collaborateur.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../../auth/entities/members.entity';
import { Entreprise, EntrepriseSchema } from '../../auth/entities/entreprises.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Collaborateur.name, schema: CollaborateurSchema },
    { name: Member.name, schema: MemberSchema },
    { name: Entreprise.name, schema: EntrepriseSchema },
  ])],
  providers: [RhCollaborateurService],
  exports: [RhCollaborateurService],
})
export class RhCollaborateurModule {}
