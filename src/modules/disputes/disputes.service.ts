import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
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

    const dispute = await this.prisma.dispute.create({
      data: {
        orderId: createDisputeDto.orderId,
        reportedBy: createDisputeDto.reportedBy,
        reason: createDisputeDto.reason,
        description: createDisputeDto.description,
        status: 'OPEN',
      },
    });

    // Update order status to disputed
    await this.prisma.order.update({
      where: { id: createDisputeDto.orderId },
      data: {
        status: 'DISPUTED',
      },
    });

    return dispute;
  }

  async getDispute(disputeId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: true,
        reporter: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async getAllDisputes(status?: string) {
    return this.prisma.dispute.findMany({
      where: status ? { status: status as any } : {},
      include: {
        order: true,
        reporter: {
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

    // Update order status based on resolution
    await this.prisma.order.update({
      where: { id: dispute.orderId },
      data: {
        status: resolveDisputeDto.orderStatus || 'COMPLETED',
      },
    });

    return updatedDispute;
  }

  async getUserDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: {
        reportedBy: userId,
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
