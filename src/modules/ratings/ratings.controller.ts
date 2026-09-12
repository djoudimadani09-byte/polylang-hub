import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  async createRating(@CurrentUser() user: any, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.createRating(user.id, createRatingDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRating(@Param('id') ratingId: string) {
    return this.ratingsService.getRating(ratingId);
  }

  @Get('translator/:translatorId')
  async getTranslatorRatings(@Param('translatorId') translatorId: string) {
    return this.ratingsService.getTranslatorRatings(translatorId);
  }
}
