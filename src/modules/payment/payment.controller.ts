import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  async processPayment(@CurrentUser() user: any, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.processPayment(user.id, createPaymentDto);
  }

  @Post(':id/confirm')
  async confirmPayment(
    @Param('id') transactionId: string,
    @Query('gatewayReference') gatewayReference: string,
  ) {
    return this.paymentService.confirmPayment(transactionId, gatewayReference);
  }

  @Get('transaction/:id')
  @UseGuards(JwtAuthGuard)
  async getTransaction(@Param('id') transactionId: string) {
    return this.paymentService.getTransaction(transactionId);
  }

  @Get('user/transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@CurrentUser() user: any) {
    return this.paymentService.getUserTransactions(user.id);
  }

  @Get('order/:orderId/transactions')
  @UseGuards(JwtAuthGuard)
  async getOrderTransactions(@Param('orderId') orderId: string) {
    return this.paymentService.getOrderTransactions(orderId);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async refundPayment(
    @Param('id') transactionId: string,
    @Body('reason') reason: string,
  ) {
    return this.paymentService.refundPayment(transactionId, reason);
  }
}
