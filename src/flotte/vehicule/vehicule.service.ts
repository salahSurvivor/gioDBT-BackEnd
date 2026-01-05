import { Injectable, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicule } from './entities/vehicule.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class VehiculeService extends BaseCrudService<Vehicule> { // 🔑 Héritage
  constructor(@InjectModel(Vehicule.name) private vehiculeModel: Model<Vehicule>) {
    super(vehiculeModel); // 🔑 Appel valide maintenant
  }
}