import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('disputes')
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDispute(@Body() createDisputeDto: CreateDisputeDto) {
    return this.disputesService.createDispute(createDisputeDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDispute(@Param('id') disputeId: string) {
    return this.disputesService.getDispute(disputeId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllDisputes(@Query('status') status?: string) {
    return this.disputesService.getAllDisputes(status);
  }

  @Get('user/my-disputes')
  @UseGuards(JwtAuthGuard)
  async getUserDisputes(@CurrentUser() user: any) {
    return this.disputesService.getUserDisputes(user.id);
  }

  @Patch(':id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async resolveDispute(
    @Param('id') disputeId: string,
    @Body() resolveDisputeDto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveDispute(disputeId, resolveDisputeDto);
  }
}
