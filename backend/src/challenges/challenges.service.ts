import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import { Unit, UnitDocument } from '../units/schemas/unit.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>
  ) {}

  async findAll(): Promise<ChallengeDocument[]> {
    return this.challengeModel.find().exec();
  }

  async create(createDto: { title: string; description: string; pointValue: number }): Promise<ChallengeDocument> {
    const created = new this.challengeModel({ ...createDto, completedBy: [] });
    return created.save();
  }

  async updateCompletions(challengeId: string, unitIds: string[]): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const newUnitObjectIds = unitIds.map(id => new Types.ObjectId(id));
    
    // First, subtract points from units that previously completed it
    await this.unitModel.updateMany(
      { _id: { $in: challenge.completedBy } },
      { $inc: { totalPoints: -challenge.pointValue } }
    );

    // Update challenge with new completions
    challenge.completedBy = newUnitObjectIds;
    await challenge.save();

    // Add points to units that have now completed it
    if (newUnitObjectIds.length > 0) {
      await this.unitModel.updateMany(
        { _id: { $in: newUnitObjectIds } },
        { $inc: { totalPoints: challenge.pointValue } }
      );
    }

    return challenge;
  }
}

