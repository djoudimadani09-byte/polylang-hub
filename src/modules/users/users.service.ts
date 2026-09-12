import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        walletBalance: true,
        languages: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        address: updateUserDto.address,
        city: updateUserDto.city,
        zipCode: updateUserDto.zipCode,
        avatar: updateUserDto.avatar,
        bio: updateUserDto.bio,
        preferredLanguage: updateUserDto.preferredLanguage,
      },
      include: {
        walletBalance: true,
      },
    });

    return user;
  }

  async getWalletBalance(userId: string) {
    const wallet = await this.prisma.walletBalance.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getAllTranslators() {
    return this.prisma.user.findMany({
      where: {
        role: 'TRANSLATOR',
        isActive: true,
      },
      include: {
        languages: true,
      },
    });
  }

  async getTranslatorStats(translatorId: string) {
    const completedOrders = await this.prisma.translation.count({
      where: {
        translatorId,
        status: 'COMPLETED',
      },
    });

    const avgRating = await this.prisma.rating.aggregate({
      where: {
        translation: {
          translatorId,
        },
      },
      _avg: {
        score: true,
      },
    });

    const totalEarnings = await this.prisma.transaction.aggregate({
      where: {
        user: {
          id: translatorId,
        },
        paymentStatus: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    return {
      completedOrders,
      averageRating: avgRating._avg.score || 0,
      totalEarnings: totalEarnings._sum.amount || 0,
    };
  }
}
