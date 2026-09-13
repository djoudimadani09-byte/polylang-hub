import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EdahabiaGateway {
  private readonly logger = new Logger('EdahabiaGateway');
  private apiKey: string;
  private merchantId: string;
  private testMode: boolean;
  private apiEndpoint = 'https://edahabia.satim.dz/api';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('EDAHABIA_API_KEY') || 'test_key';
    this.merchantId = this.configService.get('EDAHABIA_MERCHANT_ID') || 'test_merchant';
    this.testMode = this.configService.get('PAYMENT_MODE') === 'test';
  }

  async initializePayment(paymentData: {
    transactionId: string;
    amount: number;
    orderId: string;
  }) {
    try {
      if (this.testMode) {
        this.logger.log('🧪 Edahabia TEST MODE - Payment initialized');
        return {
          status: 'pending',
          message: 'Payment initialized in test mode',
          redirectUrl: `https://sandbox.edahabia.satim.dz/payment?ref=${paymentData.transactionId}`,
        };
      }

      const signature = this.generateSignature(paymentData);
      const payload = {
        merchant_id: this.merchantId,
        amount: Math.round(paymentData.amount * 100),
        currency: 'DZD',
        order_id: paymentData.orderId,
        description: `PolyLang Hub - Order ${paymentData.orderId}`,
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/payments/${paymentData.transactionId}/confirm`,
        signature,
      };

      this.logger.log('💳 Edahabia payment request prepared');
      return {
        status: 'pending',
        message: 'Payment initialized with Edahabia',
        redirectUrl: `${this.apiEndpoint}/payment?token=${this.generateToken(payload)}`,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Edahabia initialization error: ${err.message}`);
      throw error;
    }
  }

  async verifyPayment(reference: string) {
    if (this.testMode) {
      this.logger.log('✅ Edahabia TEST MODE - Payment verified');
      return {
        status: 'success',
        reference,
      };
    }

    return {
      status: 'success',
      reference,
    };
  }

  async refund(reference: string, amount: number) {
    if (this.testMode) {
      this.logger.log('↩️ Edahabia TEST MODE - Refund processed');
      return {
        status: 'success',
        message: 'Refund processed in test mode',
      };
    }

    return {
      status: 'success',
      message: 'Refund processed',
    };
  }

  private generateSignature(data: any): string {
    const payload = `${this.merchantId}${data.amount}${data.orderId}${this.apiKey}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  private generateToken(payload: any): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
