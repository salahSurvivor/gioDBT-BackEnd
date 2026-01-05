import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Entreprise extends Document {

  @Prop({ required: true })
  entrepriseNom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  telephone: string;

  @Prop()
  adresse: string;

  @Prop({ required: true })
  password: string; // hashed

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EntrepriseSchema = SchemaFactory.createForClass(Entreprise);
