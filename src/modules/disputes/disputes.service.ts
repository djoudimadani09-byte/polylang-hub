import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../../src/prisma/prisma.service'; // اضبط المسار بدقة حسب موقع المجلد
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async createDispute(createDisputeDto: CreateDisputeDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: createDisputeDto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.dispute.create({
      data: {
        orderId: createDisputeDto.orderId,
        reportedBy: createDisputeDto.reportedBy,
        reason: createDisputeDto.reason,
        description: createDisputeDto.description,
        status: 'PENDING',
      },
    });
  }

  async getDispute(disputeId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: true,
        reporter: true,
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async getAllDisputes(status?: string) {
    return this.prisma.dispute.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        order: true,
        reporter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserDisputes(user: any) {
    return this.prisma.dispute.findMany({
      where: { reportedBy: user.id },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveDispute(disputeId: string, resolveDisputeDto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const updatedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        resolution: resolveDisputeDto.resolution,
        resolvedAt: new Date(),
      },
    });

    if (resolveDisputeDto.orderStatus) {
      await this.prisma.order.update({
        where: { id: dispute.orderId },
        data: {
          status: (resolveDisputeDto.orderStatus as OrderStatus) || OrderStatus.COMPLETED,
        },
      });
    }

    return updatedDispute;
  }
}
