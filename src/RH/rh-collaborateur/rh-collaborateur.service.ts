import { Injectable, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collaborateur } from './entities/rh-collaborateur.entity'
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class RhCollaborateurService extends BaseCrudService<Collaborateur> { // 🔑 Héritage
  constructor(@InjectModel(Collaborateur.name) private collaborateurModel: Model<Collaborateur>) {
    super(collaborateurModel); // 🔑 Appel valide maintenant
  }
}