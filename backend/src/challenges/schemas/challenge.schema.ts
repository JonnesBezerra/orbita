import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  pointValue: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }] })
  completedBy: Types.ObjectId[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

