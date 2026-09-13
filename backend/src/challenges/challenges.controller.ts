import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Post()
  create(@Body() createDto: { title: string; description: string; pointValue: number }) {
    return this.challengesService.create(createDto);
  }

  @Put(':id/completions')
  updateCompletions(@Param('id') id: string, @Body('unitIds') unitIds: string[]) {
    return this.challengesService.updateCompletions(id, unitIds);
  }
}

