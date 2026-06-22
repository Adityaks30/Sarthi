import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { User, UserRole } from './database/entities/user.entity.js';
import { Vehicle } from './database/entities/vehicle.entity.js';
import { DriverProfile } from './database/entities/driver-profile.entity.js';
import { Booking } from './database/entities/booking.entity.js';
import { Payment } from './database/entities/payment.entity.js';
import { SupportTicket } from './database/entities/support-ticket.entity.js';
import { BookingsController } from './bookings/bookings.controller.js';
import { BookingsService } from './bookings/bookings.service.js';
import { WebsocketGateway } from './websocket/websocket.gateway.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { SupportModule } from './support/support.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ...(process.env.DATABASE_URL ? {} : {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'Ksaditya11',
        database: process.env.DB_DATABASE ?? 'taxi_db',
      }),
      entities: [User, Vehicle, DriverProfile, Booking, Payment, SupportTicket],
      synchronize: true, // Auto-create tables in development
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([User, Vehicle, DriverProfile, Booking, Payment, SupportTicket]),
    AuthModule,
    AdminModule,
    PaymentsModule,
    SupportModule,
  ],
  controllers: [AppController, BookingsController],
  providers: [AppService, BookingsService, WebsocketGateway],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Database Seeding: Ensure default client and driver exist on startup
  async onApplicationBootstrap() {
    console.log('[App Startup Seeding] Checking database constraints...');
    
    // 1. Ensure default client user exists with valid UUID
    let client = await this.userRepository.findOne({ where: { email: 'client_user@taxi.com' } });
    if (!client) {
      client = new User();
      client.email = 'client_user@taxi.com';
      client.name = 'Aditya Kashyap';
      client.phone = '+919999999999';
      client.role = UserRole.CLIENT;
      client.referralCode = 'ADITYA99';
      client.loyaltyPoints = 150;
      await this.userRepository.save(client);
      console.log(`[Seed] Created default client user: ${client.id}`);
    } else {
      console.log(`[Seed] Default client exists: ${client.id}`);
    }
  }
}


