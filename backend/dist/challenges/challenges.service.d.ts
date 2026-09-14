import { Model } from 'mongoose';
import { ChallengeDocument } from './schemas/challenge.schema';
import { UnitDocument } from '../units/schemas/unit.schema';
export declare class ChallengesService {
    private challengeModel;
    private unitModel;
    constructor(challengeModel: Model<ChallengeDocument>, unitModel: Model<UnitDocument>);
    findAll(): Promise<ChallengeDocument[]>;
    create(createDto: {
        title: string;
        description: string;
        pointValue: number;
    }): Promise<ChallengeDocument>;
    updateCompletions(challengeId: string, completions: {
        unitId: string;
        status: 'on_time' | 'late';
    }[]): Promise<ChallengeDocument>;
}
