import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop()
  authCode: string;

  @Prop({ default: true })
  actif: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: false })
  memberId?: Types.ObjectId;

  @Prop({ type: String, enum: ['manual', 'member'], default: 'manual' })
  source: 'manual' | 'member';

  @Prop({ type: String, enum: ['admin', 'editor', 'viewer'], required: false })
  permission?: 'admin' | 'editor' | 'viewer';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CollaborateurSchema =
  SchemaFactory.createForClass(Collaborateur);
