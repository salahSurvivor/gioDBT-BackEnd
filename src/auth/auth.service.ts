import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entreprise } from './entities/entreprises.entity';
import { Member } from './entities/members.entity';
import { Invitation } from './entities/invitation.entity';
import { Collaborateur } from '../RH/rh-collaborateur/entities/rh-collaborateur.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { RegisterMemberDto } from './dto/register-member.dto';

@Injectable()
export class authService {
  constructor(
    @InjectModel(Entreprise.name)
    private entrepriseModel: Model<Entreprise>,

    @InjectModel(Member.name)
    private memberModel: Model<Member>,

    @InjectModel(Invitation.name)
    private invitationModel: Model<Invitation>,

    @InjectModel(Collaborateur.name)
    private collaborateurModel: Model<Collaborateur>,
  ) {}

  // ================= REGISTER ENTREPRISE =================
  async registerEntreprise(data: any): Promise<Entreprise> {
    const { entrepriseNom, email, telephone, adresse, password } = data;

    const exists = await this.entrepriseModel.findOne({ email });
    if (exists) {
      throw new BadRequestException('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const totalEnreprise = await this.entrepriseModel.countDocuments({});

    const entreprise = new this.entrepriseModel({
      entrepriseNom,
      email,
      telephone,
      adresse,
      password: hashedPassword,
      authCode: entrepriseNom + '-' + (totalEnreprise + 1)
    });

    return entreprise.save();
  }

  // ================= REGISTER MEMBER =================
  async registerMember(dto: RegisterMemberDto) {
    const exists = await this.memberModel.findOne({ email: dto.email });
    if (exists) {
      throw new BadRequestException('Email dÃ©jÃ  utilisÃ©');
    }

    const invite = await this.invitationModel.findOne({
      token: dto.inviteToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invite) {
      throw new BadRequestException('Invitation invalide ou expirée');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const member = await this.memberModel.create({
      prenom: dto.firstName,
      nom: dto.lastName,
      email: dto.email,
      telephone: dto.telephone,
      password: hashedPassword,
      entrepriseId: invite.entrepriseId,
      status: 'active',
      permission: invite.permission || 'viewer',
    });

    const entreprise = await this.entrepriseModel.findById(invite.entrepriseId);
    if (!entreprise) {
      throw new BadRequestException('Entreprise introuvable');
    }

    await this.collaborateurModel.create({
      nom: dto.lastName,
      prenom: dto.firstName,
      cin: '',
      email: dto.email,
      telephone: dto.telephone,
      authCode: entreprise.authCode,
      actif: true,
      memberId: member._id,
      source: 'member',
      permission: invite.permission || 'viewer',
    });

    invite.used = true;
    await invite.save();

    return member;
  }

  // ================= LOGIN (ENTREPRISE + MEMBER) =================
  async login(email: string, password: string) {

    // ---- TRY ENTREPRISE ----
    const entreprise = await this.entrepriseModel.findOne({ email });
    if (entreprise) {
      const match = await bcrypt.compare(password, entreprise.password);
      if (!match) {
        throw new BadRequestException('Mot de passe incorrect');
      }

      const token = jwt.sign(
        {
          id: entreprise._id,
          role: 'entreprise',
          entrepriseNom: entreprise.entrepriseNom,
          email: entreprise.email,
          authCode: entreprise.authCode,
        },
        'secret',
        { expiresIn: '4h' }
      );

      return { token };
    }

    // ---- TRY MEMBER ----
    const member = await this.memberModel
      .findOne({ email })
      .populate('entrepriseId');

    if (!member) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, member.password);
    if (!match) {
      throw new BadRequestException('Mot de passe incorrect');
    }

    const entrepriseData: any = member.entrepriseId;

    const token = jwt.sign(
      {
        id: member._id,
        role: 'member',
        email: member.email,
        prenom: member.prenom,
        nom: member.nom,
        permission: member.permission,
        entrepriseId: entrepriseData?._id,
        entrepriseNom: entrepriseData?.entrepriseNom,
        authCode: entrepriseData?.authCode,
      },
      'secret',
      { expiresIn: '4h' }
    );

    return { token };
  }

  // ================= INVITATION TOKEN =================
  async generateInviteToken(
    entrepriseId: string,
    permission: 'admin' | 'editor' | 'viewer' = 'viewer',
  ) {
    const token = randomBytes(24).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return this.invitationModel.create({
      token,
      entrepriseId,
      permission,
      expiresAt,
      used: false,
    });
  }
}
