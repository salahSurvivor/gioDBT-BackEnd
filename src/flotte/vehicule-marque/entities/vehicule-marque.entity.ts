import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VehiculeMarque extends Document {
  @Prop()
  code: string;

  @Prop()
  nom: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const VehiculeMarqueSchema = SchemaFactory.createForClass(VehiculeMarque);