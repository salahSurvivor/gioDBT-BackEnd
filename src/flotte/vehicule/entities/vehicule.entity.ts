import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Vehicule extends Document {
  @Prop()
  immatriculation: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiculeMarque' })
  vehiculeMarqueId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiculeModele' })
  vehiculeModeleId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'VehiculeCarburant' })
  vehiculeCarburantId: string;

  @Prop()
  annee: number;

  @Prop()
  numeroChassis: string;

  @Prop()
  authCode: string;

  @Prop()
  etat: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const VehiculeSchema = SchemaFactory.createForClass(Vehicule);