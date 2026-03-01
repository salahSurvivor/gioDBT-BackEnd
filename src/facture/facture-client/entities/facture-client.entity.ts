import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ _id: false })
export class FactureLigne {
  @Prop()
  designation: string;

  @Prop()
  qte: number;

  @Prop()
  pu: number;

  @Prop()
  total: number;
}

const FactureLigneSchema = SchemaFactory.createForClass(FactureLigne);

@Schema()
export class FactureClient extends Document {
  @Prop()
  invoiceNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ContratLocation' })
  locationId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeId: string;

  @Prop({ type: Date })
  dateFacture: Date;

  @Prop({ type: [FactureLigneSchema], default: [] })
  lignes: FactureLigne[];

  @Prop({ type: Number })
  totalHT: number;

  @Prop({ type: Number })
  TVA: number;

  @Prop({ type: Number })
  totalTTC: number;

  @Prop({ type: String, default: 'EN_ATTENTE' })
  statutPaiement: string;

  @Prop()
  authCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FactureClientSchema = SchemaFactory.createForClass(FactureClient);
