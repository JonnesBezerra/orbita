import { UnitsService } from './units.service';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    getLeaderboard(): Promise<import("./schemas/unit.schema").UnitDocument[]>;
}
