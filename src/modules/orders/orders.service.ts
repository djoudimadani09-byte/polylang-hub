import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(clientId: string, createOrderDto: CreateOrderDto) {
    const { sourceLanguage, targetLanguage, wordCount, description } = createOrderDto;

    // Calculate price based on word count and language pair
    const pricePerWord = this.calculatePrice(sourceLanguage, targetLanguage);
    const totalPrice = wordCount * pricePerWord;

    const order = await this.prisma.order.create({
      data: {
        clientId,
        sourceLanguage,
        targetLanguage,
        wordCount,
        description,
        totalPrice,
        fileUrl: createOrderDto.fileUrl,
        fileName: createOrderDto.fileName,
        fileSize: createOrderDto.fileSize,
        documentType: createOrderDto.documentType,
        status: 'PENDING',
      },
    });

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        translations: true,
        transactions: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getClientOrders(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: {
        translations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTranslatorOrders(translatorId: string) {
    return this.prisma.order.findMany({
      where: {
        translations: {
          some: {
            translatorId,
          },
        },
      },
      include: {
        translations: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: updateOrderDto,
    });

    return order;
  }

  async assignTranslator(orderId: string, translatorId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'ASSIGNED',
        assignedTo: translatorId,
      },
    });

    // Create translation task
    await this.prisma.translation.create({
      data: {
        orderId,
        translatorId,
        draftText: '',
        status: 'DRAFT',
      },
    });

    return updatedOrder;
  }

  async getAvailableOrders(sourceLanguage: string, targetLanguage: string) {
    return this.prisma.order.findMany({
      where: {
        sourceLanguage,
        targetLanguage,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  private calculatePrice(sourceLanguage: string, targetLanguage: string): number {
    // Base price: 50 DZD per word
    let price = 50;

    // Language pair modifiers
    const rarePairs = [
      'en-ar',
      'ar-en',
      'fr-ar',
      'ar-fr',
      'de-ar',
      'ar-de',
    ];

    const languagePair = `${sourceLanguage}-${targetLanguage}`;

    if (rarePairs.includes(languagePair)) {
      price *= 1.5; // 50% premium for rare language pairs
    }

    return price;
  }
}
