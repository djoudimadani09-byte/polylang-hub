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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  async createOrder(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Get('client/my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  async getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.getClientOrders(user.id);
  }

  @Get('translator/assigned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRANSLATOR)
  async getAssignedOrders(@CurrentUser() user: any) {
    return this.ordersService.getTranslatorOrders(user.id);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRANSLATOR)
  async getAvailableOrders(
    @Query('sourceLanguage') sourceLanguage: string,
    @Query('targetLanguage') targetLanguage: string,
  ) {
    return this.ordersService.getAvailableOrders(sourceLanguage, targetLanguage);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOrder(@Param('id') orderId: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }

  @Post(':id/assign/:translatorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async assignTranslator(
    @Param('id') orderId: string,
    @Param('translatorId') translatorId: string,
  ) {
    return this.ordersService.assignTranslator(orderId, translatorId);
  }
}
