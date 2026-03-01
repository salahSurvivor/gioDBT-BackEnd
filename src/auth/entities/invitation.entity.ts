import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import type { MemberPermission } from './members.entity';

@Schema({ timestamps: true })
export class Invitation extends Document {

  @Prop({ required: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: 'entreprises_Comptes', required: true })
  entrepriseId: Types.ObjectId;

  @Prop({ type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' })
  permission: MemberPermission;

  @Prop({ default: false })
  used: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
