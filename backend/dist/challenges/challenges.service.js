"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const challenge_schema_1 = require("./schemas/challenge.schema");
const unit_schema_1 = require("../units/schemas/unit.schema");
let ChallengesService = class ChallengesService {
    constructor(challengeModel, unitModel) {
        this.challengeModel = challengeModel;
        this.unitModel = unitModel;
    }
    async findAll() {
        return this.challengeModel.find().exec();
    }
    async create(createDto) {
        const created = new this.challengeModel({ ...createDto, completedBy: [] });
        return created.save();
    }
    async updateCompletions(challengeId, completions) {
        const challenge = await this.challengeModel.findById(challengeId);
        if (!challenge) {
            throw new common_1.NotFoundException('Challenge not found');
        }
        completions = completions || [];
        challenge.completedBy = challenge.completedBy || [];
        const revertOperations = challenge.completedBy.map((completion) => {
            const points = completion.status === 'on_time'
                ? challenge.pointValue
                : Math.round(challenge.pointValue * 0.25);
            return {
                updateOne: {
                    filter: { _id: completion.unitId },
                    update: { $inc: { totalPoints: -points } },
                },
            };
        });
        if (revertOperations.length > 0) {
            await this.unitModel.bulkWrite(revertOperations);
        }
        const newCompletions = completions.map((c) => ({
            unitId: new mongoose_2.Types.ObjectId(c.unitId),
            status: c.status,
        }));
        challenge.completedBy = newCompletions;
        await challenge.save();
        const addOperations = newCompletions.map((completion) => {
            const points = completion.status === 'on_time'
                ? challenge.pointValue
                : Math.round(challenge.pointValue * 0.25);
            return {
                updateOne: {
                    filter: { _id: completion.unitId },
                    update: { $inc: { totalPoints: points } },
                },
            };
        });
        if (addOperations.length > 0) {
            await this.unitModel.bulkWrite(addOperations);
        }
        return challenge;
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(challenge_schema_1.Challenge.name)),
    __param(1, (0, mongoose_1.InjectModel)(unit_schema_1.Unit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map