import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentMethod } from '../database/entities/payment.entity.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPayment(
    @Body() body: { bookingId: string; amount: number; method: PaymentMethod },
  ) {
    return await this.paymentsService.createPayment(body.bookingId, body.amount, body.method);
  }

  @Get('booking/:bookingId')
  async getByBooking(@Param('bookingId') bookingId: string) {
    return await this.paymentsService.getPaymentsByBooking(bookingId);
  }

  @Get('history')
  async getHistory() {
    return await this.paymentsService.getPaymentHistory();
  }
}
