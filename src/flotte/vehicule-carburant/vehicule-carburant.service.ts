import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehiculeCarburant } from './entities/vehicule-carburant.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class VehiculeCarburantService extends BaseCrudService<VehiculeCarburant> { // 🔑 Héritage
  constructor(@InjectModel(VehiculeCarburant.name) private vehiculeCarburantModel: Model<VehiculeCarburant>) {
    super(vehiculeCarburantModel); // 🔑 Appel valide maintenant
  }

  // Méthode spécifique pour Vehicule (si nécessaire)
  async findByName(name: string) {
    return this.vehiculeCarburantModel.findOne({ name }).exec();
  }
}