import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authController } from './auth.controller';
import { authService } from './auth.service';
import { Entreprise, EntrepriseSchema } from './entities/entreprises.entity';
import { Invitation, InvitationSchema } from './entities/invitation.entity';
import { Member, MemberSchema } from './entities/members.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entreprise.name, schema: EntrepriseSchema },
      { name: Invitation.name, schema: InvitationSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
  controllers: [authController],
  providers: [authService],
})

export class AuthModule {}