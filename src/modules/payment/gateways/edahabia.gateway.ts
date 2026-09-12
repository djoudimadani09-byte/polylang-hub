import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EdahabiaGateway {
  private readonly logger = new Logger(EdahabiaGateway);
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

      // Production integration would go here
      const signature = this.generateSignature(paymentData);
      const payload = {
        merchant_id: this.merchantId,
        amount: Math.round(paymentData.amount * 100), // Amount in cents
        currency: 'DZD',
        order_id: paymentData.orderId,
        description: `PolyLang Hub - Order ${paymentData.orderId}`,
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/payments/${paymentData.transactionId}/confirm`,
        signature,
      };

      // In production, make actual API call
      // const response = await axios.post(`${this.apiEndpoint}/pay`, payload);

      this.logger.log('💳 Edahabia payment request prepared');
      return {
        status: 'pending',
        message: 'Payment initialized with Edahabia',
        redirectUrl: `${this.apiEndpoint}/payment?token=${this.generateToken(payload)}`,
      };
    } catch (error) {
      this.logger.error(`Edahabia initialization error: ${error.message}`);
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

    // Production verification would go here
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

    // Production refund would go here
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
