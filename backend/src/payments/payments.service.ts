import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from '../database/entities/payment.entity.js';
import { Booking, BookingStatus } from '../database/entities/booking.entity.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createPayment(bookingId: string, amount: number, method: PaymentMethod): Promise<Payment> {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const payment = new Payment();
    payment.bookingId = bookingId;
    payment.amount = amount;
    payment.method = method;
    payment.status = PaymentStatus.SUCCESS; // Auto-success for local mock gateway (e.g. Stripe simulator)
    payment.transactionId = `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Update booking status if cash or success
    if (method === PaymentMethod.CASH) {
      payment.status = PaymentStatus.PENDING;
    }

    const savedPayment = await this.paymentRepository.save(payment);
    return savedPayment;
  }

  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({ where: { bookingId } });
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return await this.paymentRepository.find({ relations: { booking: true } });
  }
}
