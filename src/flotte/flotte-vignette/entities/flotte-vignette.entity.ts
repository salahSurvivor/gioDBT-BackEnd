import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class FlotteVignette extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: Number })
  annee: number;

  @Prop({ type: Number })
  montant: number;

  @Prop({ type: Date, default: null })
  datePaiement: Date | null;

  @Prop({ type: String, default: '' })
  note: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FlotteVignetteSchema = SchemaFactory.createForClass(FlotteVignette);
