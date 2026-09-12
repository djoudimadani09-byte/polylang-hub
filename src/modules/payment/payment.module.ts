import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '@common/prisma/prisma.module';
import { EdahabiaGateway } from './gateways/edahabia.gateway';
import { GoldenCardGateway } from './gateways/golden-card.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, EdahabiaGateway, GoldenCardGateway],
  exports: [PaymentService],
})
export class PaymentModule {}
