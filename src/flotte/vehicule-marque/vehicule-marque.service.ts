import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehiculeMarque } from './entities/vehicule-marque.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class VehiculeMarqueService extends BaseCrudService<VehiculeMarque> { // 🔑 Héritage
  constructor(@InjectModel(VehiculeMarque.name) private vehiculeMarqueModel: Model<VehiculeMarque>) {
    super(vehiculeMarqueModel); // 🔑 Appel valide maintenant
  }

  // Méthode spécifique pour Vehicule (si nécessaire)
  async findByName(name: string) {
    return this.vehiculeMarqueModel.findOne({ name }).exec();
  }
}