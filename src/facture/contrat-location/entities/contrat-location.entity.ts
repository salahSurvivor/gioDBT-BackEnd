import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class ContratLocation extends Document {
  @Prop({ type: String })
  numero: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: Date })
  dateDebut: Date;

  @Prop({ type: Date })
  dateFin: Date;

  @Prop({ type: Number })
  prixParJour: number;

  @Prop({ type: Number, default: null })
  caution: number | null;

  @Prop({ type: Number, default: null })
  kmDebut: number | null;

  @Prop({ type: Number, default: null })
  kmFin: number | null;

  @Prop({ type: String, default: 'EN_COURS' })
  statut: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ContratLocationSchema = SchemaFactory.createForClass(ContratLocation);
