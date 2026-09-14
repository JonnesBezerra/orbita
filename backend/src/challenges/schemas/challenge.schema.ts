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

  @Prop({
    type: [
      {
        unitId: { type: Types.ObjectId, ref: 'Unit' },
        status: { type: String, enum: ['on_time', 'late'] },
      },
    ],
  })
  completedBy: { unitId: Types.ObjectId; status: 'on_time' | 'late' }[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
