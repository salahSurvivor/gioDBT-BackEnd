import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class FlotteAffectation extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collaborateur' })
  collaborateurId: string;

  @Prop({ type: Date })
  dateDebut: Date;

  @Prop({ type: Date, default: null })
  dateFin: Date | null;

  @Prop({ type: String })
  statut: string;

  @Prop({ type: Number, default: null })
  kilometrageDebut: number | null;

  @Prop({ type: Number, default: null })
  kilometrageFin: number | null;

  @Prop({ type: String })
  note: string;

  @Prop({ type: String })
  authCode: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const FlotteAffectationSchema = SchemaFactory.createForClass(FlotteAffectation);
