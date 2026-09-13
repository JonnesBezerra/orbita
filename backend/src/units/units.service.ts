import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from './schemas/unit.schema';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async findAllSortedByPoints(): Promise<UnitDocument[]> {
    return this.unitModel.find().sort({ totalPoints: -1 }).exec();
  }
}

