import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { Entreprise, EntrepriseSchema } from '../auth/entities/entreprises.entity';
import { Member, MemberSchema } from '../auth/entities/members.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entreprise.name, schema: EntrepriseSchema },
      { name: Member.name, schema: MemberSchema }
    ])
  ],
  controllers: [ProfileController]
})
export class ProfileModule {}
