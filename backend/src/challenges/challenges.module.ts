import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './schemas/challenge.schema';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UnitsModule } from '../units/units.module';
import { Unit, UnitSchema } from '../units/schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Unit.name, schema: UnitSchema },
    ]),
    UnitsModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}

