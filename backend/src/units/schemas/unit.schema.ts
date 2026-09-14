import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema()
export class Unit {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['Masculino', 'Feminino'] })
  category: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop({ default: 0 })
  totalPoints: number;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
