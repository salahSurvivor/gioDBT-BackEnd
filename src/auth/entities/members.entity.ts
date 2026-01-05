import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Member extends Document {

  @Prop()
  prenom: string;

  @Prop()
  nom: string;

  @Prop()
  email: string;

  @Prop()
  telephone: string;

  @Prop()
  password: string;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entrepriseId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
