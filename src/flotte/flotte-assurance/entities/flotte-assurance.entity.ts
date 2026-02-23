import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class FlotteAssurance extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AssuranceCompagnie' })
  assuranceCompagnieId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AssuranceType' })
  assuranceTypeId: string;

  @Prop()
  numeroPolice: string;

  @Prop({ type: Date })
  dateDebut: Date;

  @Prop({ type: Date })
  dateFin: Date;

  @Prop({ type: Number, default: null })
  montantPrime: number | null;

  @Prop({ type: String })
  etat: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FlotteAssuranceSchema = SchemaFactory.createForClass(FlotteAssurance);
