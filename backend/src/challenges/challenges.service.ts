import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import { Unit, UnitDocument } from '../units/schemas/unit.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
  ) {}

  async findAll(): Promise<ChallengeDocument[]> {
    return this.challengeModel.find().exec();
  }

  async create(createDto: {
    title: string;
    description: string;
    pointValue: number;
  }): Promise<ChallengeDocument> {
    const created = new this.challengeModel({ ...createDto, completedBy: [] });
    return created.save();
  }

  async updateCompletions(
    challengeId: string,
    completions: { unitId: string; status: 'on_time' | 'late' }[],
  ): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    completions = completions || [];
    challenge.completedBy = challenge.completedBy || [];

    // First, subtract points from units that previously completed it
    const revertOperations = challenge.completedBy.map((completion) => {
      const points =
        completion.status === 'on_time'
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
      await this.unitModel.bulkWrite(revertOperations as any);
    }

    // Update challenge with new completions
    const newCompletions = completions.map((c) => ({
      unitId: new Types.ObjectId(c.unitId),
      status: c.status,
    }));
    challenge.completedBy = newCompletions;
    await challenge.save();

    // Add points to units that have now completed it
    const addOperations = newCompletions.map((completion) => {
      const points =
        completion.status === 'on_time'
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
      await this.unitModel.bulkWrite(addOperations as any);
    }

    return challenge;
  }
}
