import { Document } from 'mongoose';
export type UnitDocument = Unit & Document;
export declare class Unit {
    name: string;
    category: string;
    color: string;
    class: string;
    logoUrl: string;
    totalPoints: number;
}
export declare const UnitSchema: import("mongoose").Schema<Unit, import("mongoose").Model<Unit, any, any, any, Document<unknown, any, Unit, any, {}> & Unit & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Unit, Document<unknown, {}, import("mongoose").FlatRecord<Unit>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Unit> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
