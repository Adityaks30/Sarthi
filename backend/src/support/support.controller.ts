import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SupportService } from './support.service.js';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(
    @Body() body: { userId: string; category: string; subject: string; message: string },
  ) {
    return await this.supportService.createTicket(body.userId, body.category, body.subject, body.message);
  }

  @Get('tickets/user/:userId')
  async getTickets(@Param('userId') userId: string) {
    return await this.supportService.getTicketsByUser(userId);
  }

  @Post('chatbot')
  async getChatbotReply(@Body() body: { message: string }) {
    return await this.supportService.getChatbotReply(body.message);
  }
}
