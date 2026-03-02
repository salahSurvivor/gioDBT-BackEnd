import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Collaborateur extends Document {

  @Prop()
  nom: string;

  @Prop()
  prenom: string;

  @Prop()
  cin: string;

  @Prop()
  email: string;

  @Prop()
  telephone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RhPoste', default: null })
  posteId: string | null;

  @Prop({ type: Date, default: null })
  dateEmbauche: Date | null;

  @Prop()
  authCode: string;

  @Prop({ default: true })
  actif: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CollaborateurSchema =
  SchemaFactory.createForClass(Collaborateur);
