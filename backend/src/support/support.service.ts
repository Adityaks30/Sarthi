import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from '../database/entities/support-ticket.entity.js';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
  ) {}

  async createTicket(userId: string, category: string, subject: string, message: string): Promise<SupportTicket> {
    const ticket = new SupportTicket();
    ticket.userId = userId;
    ticket.category = category;
    ticket.subject = subject;
    ticket.message = message;
    ticket.status = TicketStatus.OPEN;
    return await this.ticketRepository.save(ticket);
  }

  async getTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return await this.ticketRepository.find({ where: { userId } });
  }

  async getChatbotReply(message: string): Promise<{ reply: string }> {
    const text = message.toLowerCase();
    let reply = "I'm sorry, I didn't quite catch that. You can ask me about cancellations, refunds, booking process, or payment methods!";

    if (text.includes('cancel') || text.includes('cancellation')) {
      reply = "You can cancel any ride before the driver accepts without penalty. Go to your active ride tracking screen and click 'Cancel Ride'.";
    } else if (text.includes('refund') || text.includes('money') || text.includes('wallet')) {
      reply = "Refunds for cancelled rides are processed instantly to your Sarthi Wallet or original payment method (3-5 business days for cards).";
    } else if (text.includes('pay') || text.includes('payment') || text.includes('upi') || text.includes('card')) {
      reply = "Sarthi supports UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on delivery. You can choose the payment mode in the booking wizard.";
    } else if (text.includes('book') || text.includes('ride') || text.includes('rental')) {
      reply = "To book a ride, input your pickup & drop-off locations, select your vehicle type (Mini, Sedan, SUV, etc.), choose your payment method, and confirm!";
    } else if (text.includes('driver') || text.includes('contact') || text.includes('phone')) {
      reply = "Once a driver accepts your booking, their verified details (Name, License Plate, Rating, Phone Number) will appear on your tracking screen.";
    }

    return { reply };
  }
}
