import { Document, Types } from 'mongoose';
export type ChallengeDocument = Challenge & Document;
export declare class Challenge {
    title: string;
    description: string;
    pointValue: number;
    completedBy: Types.ObjectId[];
}
export declare const ChallengeSchema: import("mongoose").Schema<Challenge, import("mongoose").Model<Challenge, any, any, any, Document<unknown, any, Challenge, any, {}> & Challenge & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Challenge, Document<unknown, {}, import("mongoose").FlatRecord<Challenge>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Challenge> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
