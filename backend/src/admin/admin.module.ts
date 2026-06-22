import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity.js';
import { Booking } from '../database/entities/booking.entity.js';
import { Vehicle } from '../database/entities/vehicle.entity.js';
import { DriverProfile } from '../database/entities/driver-profile.entity.js';
import { SupportTicket } from '../database/entities/support-ticket.entity.js';
import { Payment } from '../database/entities/payment.entity.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking, Vehicle, DriverProfile, SupportTicket, Payment]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
