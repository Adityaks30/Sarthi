import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { WebsocketGateway } from '../websocket/websocket.gateway.js';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    const booking = await this.bookingsService.createBooking(dto);
    // Trigger simulation in the background
    this.websocketGateway.runRideSimulation(booking.id);
    return booking;
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return await this.bookingsService.getBooking(id);
  }
}
