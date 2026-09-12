import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  async getTranslation(translationId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { id: translationId },
      include: {
        order: true,
        translator: true,
      },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async updateDraft(translationId: string, draftText: string) {
    const translation = await this.prisma.translation.update({
      where: { id: translationId },
      data: {
        draftText,
        status: 'IN_REVIEW',
      },
    });

    return translation;
  }

  async submitFinal(translationId: string, finalText: string) {
    const translation = await this.prisma.translation.update({
      where: { id: translationId },
      data: {
        finalText,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: translation.orderId },
      data: {
        status: 'COMPLETED',
      },
    });

    return translation;
  }

  async rejectTranslation(translationId: string, reason: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { id: translationId },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    const updatedTranslation = await this.prisma.translation.update({
      where: { id: translationId },
      data: {
        status: 'REJECTED',
        draftText: reason,
      },
    });

    // Update order status back to assigned
    await this.prisma.order.update({
      where: { id: translation.orderId },
      data: {
        status: 'ASSIGNED',
      },
    });

    return updatedTranslation;
  }

  async getTranslatorWorkspace(translatorId: string) {
    return this.prisma.translation.findMany({
      where: {
        translatorId,
      },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
