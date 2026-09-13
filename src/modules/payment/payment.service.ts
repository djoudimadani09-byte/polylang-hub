import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EdahabiaGateway } from './gateways/edahabia.gateway';
import { GoldenCardGateway } from './gateways/golden-card.gateway';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger('PaymentService');

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private edahabiaGateway: EdahabiaGateway,
    private goldenCardGateway: GoldenCardGateway,
  ) {}

  async processPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const { orderId, amount, paymentMethod } = createPaymentDto;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.clientId !== userId) {
      throw new BadRequestException('Unauthorized to pay this order');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        orderId,
        userId,
        amount,
        currency: 'DZD',
        paymentMethod,
        paymentStatus: PaymentStatus.PROCESSING,
      },
    });

    try {
      let paymentResult;

      switch (paymentMethod) {
        case PaymentMethod.EDAHABIA:
          paymentResult = await this.edahabiaGateway.initializePayment({
            transactionId: transaction.id,
            amount,
            orderId,
          });
          break;

        case PaymentMethod.GOLDEN_CARD:
          paymentResult = await this.goldenCardGateway.initializePayment({
            transactionId: transaction.id,
            amount,
            orderId,
          });
          break;

        case PaymentMethod.WALLET:
          paymentResult = await this.processWalletPayment(userId, amount, transaction.id);
          break;

        default:
          throw new BadRequestException('Unsupported payment method');
      }

      return {
        transactionId: transaction.id,
        status: paymentResult.status,
        redirectUrl: paymentResult.redirectUrl,
        message: paymentResult.message,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Payment processing error: ${err.message}`);

      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });

      throw new BadRequestException(`Payment failed: ${err.message}`);
    }
  }

  async confirmPayment(transactionId: string, gatewayReference: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        gatewayReference,
      },
    });

    await this.prisma.order.update({
      where: { id: transaction.orderId },
      data: {
        status: 'PENDING',
      },
    });

    return updatedTransaction;
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return transaction;
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderTransactions(orderId: string) {
    return this.prisma.transaction.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refundPayment(transactionId: string, reason: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    if (transaction.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    if (transaction.paymentMethod === PaymentMethod.EDAHABIA) {
      await this.edahabiaGateway.refund(transaction.gatewayReference || '', transaction.amount);
    } else if (transaction.paymentMethod === PaymentMethod.GOLDEN_CARD) {
      await this.goldenCardGateway.refund(transaction.gatewayReference || '', transaction.amount);
    }

    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });
  }

  private async processWalletPayment(userId: string, amount: number, transactionId: string) {
    const wallet = await this.prisma.walletBalance.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await this.prisma.walletBalance.update({
      where: { userId },
      data: { balance: wallet.balance - amount },
    });

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: PaymentStatus.COMPLETED },
    });

    return {
      status: 'success',
      message: 'Payment processed from wallet',
      redirectUrl: null as string | null,
    };
  }
}
