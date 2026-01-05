import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { Entreprise } from '../auth/entities/entreprises.entity';
import { Member } from '../auth/entities/members.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    @InjectModel(Entreprise.name)
    private entrepriseModel: Model<Entreprise>,

    @InjectModel(Member.name)
    private memberModel: Model<Member>,
  ) {}

  @Get()
  async getProfile(@Req() req) {

    // ===== ENTREPRISE =====
    if (req.user.role === 'entreprise') {
      return this.entrepriseModel
        .findById(req.user.id)
        .select('-password');
    }

    // ===== MEMBER =====
    if (req.user.role === 'member') {
      return this.memberModel
        .findById(req.user.id)
        .select('-password')
        .populate('entrepriseId', 'entrepriseNom email telephone adresse');
    }

    return null;
  }
}
