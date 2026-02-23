import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class FlotteAdblue extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: Date })
  dateOperation: Date;

  @Prop({ type: Number, default: null })
  quantite: number | null;

  @Prop({ type: Number, default: null })
  prixUnitaire: number | null;

  @Prop({ type: Number, default: null })
  montantTotal: number | null;

  @Prop({ type: Number, default: null })
  kilometrage: number | null;

  @Prop({ type: String })
  station: string;

  @Prop({ type: String })
  note: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FlotteAdblueSchema = SchemaFactory.createForClass(FlotteAdblue);
