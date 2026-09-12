import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createRating(clientId: string, createRatingDto: CreateRatingDto) {
    const translation = await this.prisma.translation.findUnique({
      where: { id: createRatingDto.translationId },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    if (translation.status !== 'COMPLETED') {
      throw new BadRequestException('Can only rate completed translations');
    }

    // Check if rating already exists
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        translationId_clientId: {
          translationId: createRatingDto.translationId,
          clientId,
        },
      },
    });

    if (existingRating) {
      throw new BadRequestException('Rating already exists for this translation');
    }

    const rating = await this.prisma.rating.create({
      data: {
        translationId: createRatingDto.translationId,
        clientId,
        score: createRatingDto.score,
        comment: createRatingDto.comment,
      },
    });

    return rating;
  }

  async getRating(ratingId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
      include: {
        translation: true,
        client: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    return rating;
  }

  async getTranslatorRatings(translatorId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        translation: {
          translatorId,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalRatings = ratings.length;
    const averageScore =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0;

    return {
      totalRatings,
      averageScore: parseFloat(averageScore.toFixed(2)),
      ratings,
    };
  }
}
