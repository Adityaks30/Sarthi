import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../database/entities/booking.entity.js';
import { User, UserRole } from '../database/entities/user.entity.js';
import { DriverProfile, KYCStatus } from '../database/entities/driver-profile.entity.js';
import {
  Vehicle,
  VehicleCategory,
  MaintenanceStatus,
} from '../database/entities/vehicle.entity.js';
import * as bcrypt from 'bcrypt';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DriverProfile)
    private readonly driverProfileRepository: Repository<DriverProfile>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_booking')
  handleJoinBooking(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`booking_${data.bookingId}`);
    console.log(`Client joined room: booking_${data.bookingId}`);
  }

  // Simulation Worker for autonomous demo rides
  async runRideSimulation(bookingId: string) {
    // Load active booking
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) return;

    // Pool of drivers with vehicle attributes matching display categories
    const mockDriversPool = [
      {
        email: 'driver_ramesh@taxi.com',
        phone: '+919876543210',
        name: 'Ramesh Kumar',
        rating: 4.9,
        vehicleMake: 'Tata',
        vehicleModel: 'Tiago EV',
        category: VehicleCategory.MINI,
        licensePlate: 'KA-03-EV-1234'
      },
      {
        email: 'driver_anil@taxi.com',
        phone: '+919876543211',
        name: 'Anil Vasudevan',
        rating: 4.8,
        vehicleMake: 'Hyundai',
        vehicleModel: 'Verna',
        category: VehicleCategory.SEDAN,
        licensePlate: 'KA-01-MD-5678'
      },
      {
        email: 'driver_priya@taxi.com',
        phone: '+919876543212',
        name: 'Priya Singh',
        rating: 4.7,
        vehicleMake: 'Maruti',
        vehicleModel: 'Brezza',
        category: VehicleCategory.SUV,
        licensePlate: 'KA-04-SUV-9012'
      },
      {
        email: 'driver_suresh@taxi.com',
        phone: '+919876543213',
        name: 'Suresh Prasad',
        rating: 4.6,
        vehicleMake: 'Toyota',
        vehicleModel: 'Fortuner',
        category: VehicleCategory.SUV,
        licensePlate: 'KA-02-FT-4321'
      },
      {
        email: 'driver_aditya@taxi.com',
        phone: '+919876543214',
        name: 'Aditya Sen',
        rating: 4.9,
        vehicleMake: 'BYD',
        vehicleModel: 'Seal',
        category: VehicleCategory.LUXURY,
        licensePlate: 'KA-05-LX-7890'
      }
    ];

    // Select matching driver from the pool
    let selectedMock = mockDriversPool.find(
      (d) => d.category === booking.vehicleCategory,
    );
    if (!selectedMock) {
      selectedMock = mockDriversPool[0]; // fallback
    }

    // 1. Create a mock driver user if not exists
    let mockDriverUser = await this.userRepository.findOne({
      where: [
        { email: selectedMock.email },
        { phone: selectedMock.phone }
      ],
    });
    if (!mockDriverUser) {
      mockDriverUser = new User();
      mockDriverUser.email = selectedMock.email;
      mockDriverUser.name = selectedMock.name;
      mockDriverUser.password = await bcrypt.hash('password123', 10);
      mockDriverUser.phone = selectedMock.phone;
      mockDriverUser.role = UserRole.DRIVER;
      mockDriverUser = await this.userRepository.save(mockDriverUser);
    }

    let profile = await this.driverProfileRepository.findOne({
      where: { userId: mockDriverUser.id },
      relations: { vehicle: true },
    });

    if (!profile) {
      // Create profile
      profile = new DriverProfile();
      profile.userId = mockDriverUser.id;
      profile.isOnline = true;
      profile.kycStatus = KYCStatus.APPROVED;
      profile.latitude = booking.startLatitude;
      profile.longitude = booking.startLongitude;
      profile.rating = selectedMock.rating;

      // Create vehicle
      const vehicle = new Vehicle();
      vehicle.make = selectedMock.vehicleMake;
      vehicle.model = selectedMock.vehicleModel;
      vehicle.year = 2026;
      vehicle.licensePlate = selectedMock.licensePlate;
      vehicle.category = selectedMock.category;
      vehicle.maintenanceStatus = MaintenanceStatus.ACTIVE;

      const savedVehicle = await this.driverProfileRepository.manager.save(vehicle);
      profile.vehicleId = savedVehicle.id;
      profile.vehicle = savedVehicle;
      profile = await this.driverProfileRepository.save(profile);
    } else {
      profile.isOnline = true;
      profile.latitude = booking.startLatitude;
      profile.longitude = booking.startLongitude;
      profile = await this.driverProfileRepository.save(profile);
    }

    // Accept Booking
    booking.driverId = mockDriverUser.id;
    booking.status = BookingStatus.ACCEPTED;
    await this.bookingRepository.save(booking);

    this.server.to(`booking_${bookingId}`).emit('booking:status_changed', {
      bookingId,
      status: BookingStatus.ACCEPTED,
      driver: {
        name: mockDriverUser.name,
        phone: mockDriverUser.phone,
        rating: profile.rating,
        vehicle: profile.vehicle ? {
          make: profile.vehicle.make,
          model: profile.vehicle.model,
          licensePlate: profile.vehicle.licensePlate,
          category: profile.vehicle.category
        } : null
      },
    });

    // Start simulation route update interval
    const coordinates = booking.routeCoordinates || [];
    if (coordinates.length === 0) return;

    let currentStep = 0;
    const intervalId = setInterval(async () => {
      if (currentStep >= coordinates.length) {
        clearInterval(intervalId);

        // Mark ride as completed
        booking.status = BookingStatus.COMPLETED;
        await this.bookingRepository.save(booking);

        this.server.to(`booking_${bookingId}`).emit('booking:status_changed', {
          bookingId,
          status: BookingStatus.COMPLETED,
        });
        return;
      }

      const point = coordinates[currentStep];
      profile.latitude = point.lat;
      profile.longitude = point.lng;
      await this.driverProfileRepository.save(profile);

      this.server.to(`booking_${bookingId}`).emit('driver:location_updated', {
        bookingId,
        latitude: point.lat,
        longitude: point.lng,
      });

      currentStep++;
    }, 2000); // update every 2 seconds
  }
}
