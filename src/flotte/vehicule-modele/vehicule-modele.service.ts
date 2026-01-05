import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehiculeModele } from './entities/vehicule-modele.entity';
import { BaseCrudService } from 'src/common/base-crud.service';

@Injectable()
export class VehiculeModeleService extends BaseCrudService<VehiculeModele> { // 🔑 Héritage
  constructor(@InjectModel(VehiculeModele.name) private vehiculeModeleModel: Model<VehiculeModele>) {
    super(vehiculeModeleModel); // 🔑 Appel valide maintenant
  }

  // Méthode spécifique pour Vehicule (si nécessaire)
  async findByName(name: string) {
    return this.vehiculeModeleModel.findOne({ name }).exec();
  }
}