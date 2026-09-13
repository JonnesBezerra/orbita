import { Model } from 'mongoose';
import { UnitDocument } from './schemas/unit.schema';
export declare class UnitsService {
    private unitModel;
    constructor(unitModel: Model<UnitDocument>);
    findAllSortedByPoints(): Promise<UnitDocument[]>;
}
