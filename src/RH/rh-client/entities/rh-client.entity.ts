import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop()
  nom: string;

  @Prop()
  prenom: string;

  @Prop()
  raisonSociale: string;

  @Prop()
  cinIce: string;

  @Prop()
  telephone: string;

  @Prop()
  email: string;

  @Prop()
  adresse: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
