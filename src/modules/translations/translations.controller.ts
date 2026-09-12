import { Controller, Get, Patch, Post, Param, Body, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('translations')
export class TranslationsController {
  constructor(private translationsService: TranslationsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTranslation(@Param('id') translationId: string) {
    return this.translationsService.getTranslation(translationId);
  }

  @Patch(':id/draft')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRANSLATOR)
  async updateDraft(
    @Param('id') translationId: string,
    @Body('draftText') draftText: string,
  ) {
    return this.translationsService.updateDraft(translationId, draftText);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRANSLATOR)
  async submitFinal(
    @Param('id') translationId: string,
    @Body('finalText') finalText: string,
  ) {
    return this.translationsService.submitFinal(translationId, finalText);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async rejectTranslation(
    @Param('id') translationId: string,
    @Body('reason') reason: string,
  ) {
    return this.translationsService.rejectTranslation(translationId, reason);
  }

  @Get('workspace')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRANSLATOR)
  async getWorkspace(@CurrentUser() user: any) {
    return this.translationsService.getTranslatorWorkspace(user.id);
  }
}
