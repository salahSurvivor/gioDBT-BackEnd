import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VehiculeCarburant extends Document {
  @Prop()
  code: string;

  @Prop()
  nom: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const VehiculeCarburantSchema = SchemaFactory.createForClass(VehiculeCarburant);