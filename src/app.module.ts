import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { PaymentModule } from './modules/payment/payment.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.docker' : '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    TranslationsModule,
    PaymentModule,
    DisputesModule,
    RatingsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
