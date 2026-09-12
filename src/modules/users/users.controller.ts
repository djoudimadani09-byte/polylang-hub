import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Get('wallet')
  @UseGuards(JwtAuthGuard)
  async getWallet(@CurrentUser() user: any) {
    return this.usersService.getWalletBalance(user.id);
  }

  @Get('translators')
  async getAllTranslators() {
    return this.usersService.getAllTranslators();
  }

  @Get('translators/:id/stats')
  async getTranslatorStats(@Param('id') translatorId: string) {
    return this.usersService.getTranslatorStats(translatorId);
  }
}
