import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from 'src/common/base-crud.service';
import { FlotteVignette } from './entities/flotte-vignette.entity';

@Injectable()
export class FlotteVignetteService extends BaseCrudService<FlotteVignette> {
  constructor(
    @InjectModel(FlotteVignette.name)
    private flotteVignetteModel: Model<FlotteVignette>,
  ) {
    super(flotteVignetteModel);
  }

  private async validateBusinessRules(payload: any, currentId?: string) {
    const montant = Number(payload?.montant);
    if (!Number.isFinite(montant) || montant <= 0) {
      throw new BadRequestException('Le montant doit etre superieur a 0');
    }

    const annee = Number(payload?.annee);
    if (!Number.isInteger(annee)) {
      throw new BadRequestException("L'annee est obligatoire");
    }

    const query: any = {
      vehiculeId: payload?.vehiculeId,
      annee,
      authCode: payload?.authCode || '',
    };

    if (currentId) query._id = { $ne: currentId };

    const existing = await this.flotteVignetteModel.exists(query);
    if (existing) {
      throw new BadRequestException('Ce vehicule a deja une vignette pour la meme annee');
    }
  }

  async create(createDto: any): Promise<FlotteVignette> {
    await this.validateBusinessRules(createDto);
    return super.create(createDto);
  }

  async update(id: string, updateDto: any): Promise<FlotteVignette> {
    const currentRecord = await this.flotteVignetteModel.findById(id).lean();
    if (!currentRecord) return super.update(id, updateDto);

    const merged = {
      ...currentRecord,
      ...updateDto,
      authCode: updateDto?.authCode || currentRecord?.authCode || '',
    };

    await this.validateBusinessRules(merged, id);
    return super.update(id, updateDto);
  }
}
