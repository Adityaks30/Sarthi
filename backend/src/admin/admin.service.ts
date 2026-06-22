import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity.js';
import { Booking } from '../database/entities/booking.entity.js';
import { Vehicle } from '../database/entities/vehicle.entity.js';
import { DriverProfile } from '../database/entities/driver-profile.entity.js';
import { SupportTicket } from '../database/entities/support-ticket.entity.js';
import { Payment } from '../database/entities/payment.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(DriverProfile)
    private readonly driverProfileRepository: Repository<DriverProfile>,
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboardStats() {
    const clientsCount = await this.userRepository.count({ where: { role: UserRole.CLIENT } });
    const driversCount = await this.userRepository.count({ where: { role: UserRole.DRIVER } });
    const vehiclesCount = await this.vehicleRepository.count();
    const activeBookingsCount = await this.bookingRepository.count();
    const openTicketsCount = await this.ticketRepository.count();

    // Sum earnings
    const payments = await this.paymentRepository.find({ where: { status: 'SUCCESS' as any } });
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalClients: clientsCount,
      totalDrivers: driversCount,
      totalVehicles: vehiclesCount,
      activeBookings: activeBookingsCount,
      openTickets: openTicketsCount,
      totalEarnings,
    };
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getDrivers() {
    return await this.driverProfileRepository.find({ relations: { user: true, vehicle: true } });
  }

  async getVehicles() {
    return await this.vehicleRepository.find();
  }

  async getBookings() {
    return await this.bookingRepository.find({ relations: { user: true, driver: true } });
  }

  async getEarningsAnalytics() {
    // Generate mock analytics monthly records
    return [
      { month: 'Jan', earnings: 12000, rides: 140 },
      { month: 'Feb', earnings: 19000, rides: 220 },
      { month: 'Mar', earnings: 15000, rides: 180 },
      { month: 'Apr', earnings: 28000, rides: 310 },
      { month: 'May', earnings: 32000, rides: 350 },
      { month: 'Jun', earnings: 45000, rides: 500 },
    ];
  }
}
