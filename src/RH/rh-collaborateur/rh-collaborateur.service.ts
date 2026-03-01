import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collaborateur } from './entities/rh-collaborateur.entity';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Member } from '../../auth/entities/members.entity';
import { Entreprise } from '../../auth/entities/entreprises.entity';

@Injectable()
export class RhCollaborateurService extends BaseCrudService<Collaborateur> {
  constructor(
    @InjectModel(Collaborateur.name) private collaborateurModel: Model<Collaborateur>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Entreprise.name) private entrepriseModel: Model<Entreprise>,
  ) {
    super(collaborateurModel);
  }

  async find(query: any, dto: any): Promise<any> {
    const entreprise = await this.resolveEntreprise(query);
    const memberIds = await this.syncMembersFromEntreprise(entreprise);

    const { currentPage, paginatorNumber, recordFilter } = dto;
    const filter = this.buildRhFilter(entreprise?.authCode, memberIds, recordFilter);

    const total = await this.collaborateurModel.countDocuments(filter);

    const data = await this.collaborateurModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(paginatorNumber)
      .skip((currentPage - 1) * paginatorNumber)
      .lean()
      .exec();

    return { total, data };
  }

  async findAll(query: any): Promise<Collaborateur[]> {
    const entreprise = await this.resolveEntreprise(query);
    const memberIds = await this.syncMembersFromEntreprise(entreprise);
    const filter = this.buildRhFilter(entreprise?.authCode, memberIds);
    return this.collaborateurModel.find(filter).exec();
  }

  private async resolveEntreprise(query: any): Promise<any | null> {
    if (query?.entrepriseId) {
      const byId = await this.entrepriseModel.findById(query.entrepriseId).lean();
      if (byId?._id) return byId;
    }

    if (query?.authCode) {
      const byAuth = await this.entrepriseModel.findOne({ authCode: query.authCode }).lean();
      if (byAuth?._id) return byAuth;
    }

    return null;
  }

  private async syncMembersFromEntreprise(entreprise: any): Promise<Types.ObjectId[]> {
    if (!entreprise?._id) return [];

    const entrepriseId = entreprise._id;
    const entrepriseIdStr = String(entreprise._id);

    // Support both ObjectId and legacy string storage for entrepriseId.
    const members = await this.memberModel.find({
      $or: [
        { entrepriseId },
        { entrepriseId: entrepriseIdStr },
      ],
    }).lean();
    if (!members.length) return [];

    const operations = members.map((member) => ({
      updateOne: {
        filter: { memberId: member._id },
        update: {
          $set: {
            nom: member.nom || '',
            prenom: member.prenom || '',
            email: member.email || '',
            telephone: member.telephone || '',
            authCode: entreprise.authCode || '',
            actif: member.status !== 'inactive',
            source: 'member',
            permission: member.permission || 'viewer',
          },
        },
        upsert: true,
      },
    }));

    await this.collaborateurModel.bulkWrite(operations);
    return members.map((member: any) => member._id as Types.ObjectId);
  }

  private buildRhFilter(
    authCode?: string,
    memberIds: Types.ObjectId[] = [],
    recordFilter?: any,
  ): any {
    const sources: any[] = [];

    if (authCode) {
      sources.push({ authCode });
    }

    if (memberIds.length) {
      sources.push({ memberId: { $in: memberIds } });
    }

    const filter: any = sources.length > 1 ? { $or: sources } : sources[0] || { _id: null };

    if (recordFilter && typeof recordFilter === 'object') {
      Object.keys(recordFilter).forEach((key) => {
        const value = recordFilter[key];
        if (value !== null && value !== undefined && value !== '') {
          filter[key] = value;
        }
      });
    }

    return filter;
  }
}
