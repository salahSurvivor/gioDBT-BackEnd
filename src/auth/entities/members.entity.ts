import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MemberPermission = 'admin' | 'editor' | 'viewer';

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

  @Prop({ type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' })
  permission: MemberPermission;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entrepriseId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
