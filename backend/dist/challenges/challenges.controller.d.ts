import { ChallengesService } from './challenges.service';
export declare class ChallengesController {
    private readonly challengesService;
    constructor(challengesService: ChallengesService);
    findAll(): Promise<import("./schemas/challenge.schema").ChallengeDocument[]>;
    create(createDto: {
        title: string;
        description: string;
        pointValue: number;
    }): Promise<import("./schemas/challenge.schema").ChallengeDocument>;
    updateCompletions(id: string, completions: {
        unitId: string;
        status: 'on_time' | 'late';
    }[]): Promise<import("./schemas/challenge.schema").ChallengeDocument>;
}
