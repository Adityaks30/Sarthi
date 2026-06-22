import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../database/entities/booking.entity.js';
import { User } from '../database/entities/user.entity.js';
import { VehicleCategory } from '../database/entities/vehicle.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Mock Rental Packages
  private readonly rentalPackages = [
    { id: 'pkg-1', name: '2 Hours / 20 Km', distanceKm: 20, price: 500 },
    { id: 'pkg-2', name: '4 Hours / 40 Km', distanceKm: 40, price: 900 },
    { id: 'pkg-3', name: '8 Hours / 80 Km', distanceKm: 80, price: 1800 },
  ];

  getCarbonEmissionFactor(category?: VehicleCategory): number {
    switch (category) {
      case VehicleCategory.MINI:
        return 0.05; // EV / Small car
      case VehicleCategory.SEDAN:
        return 0.12;
      case VehicleCategory.SUV:
        return 0.18;
      case VehicleCategory.LUXURY:
        return 0.15;
      default:
        return 0.10;
    }
  }

  generateRoutePoints(startLat: number, startLng: number, endLat: number, endLng: number) {
    const points: { lat: number; lng: number }[] = [];
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const fraction = i / steps;
      points.push({
        lat: startLat + (endLat - startLat) * fraction,
        lng: startLng + (endLng - startLng) * fraction,
      });
    }
    return points;
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const booking = new Booking();
    
    // Look up the default seed user
    const client = await this.userRepository.findOne({ where: { email: 'client_user@taxi.com' } });
    booking.userId = client ? client.id : '00000000-0000-0000-0000-000000000000';

    booking.startLatitude = dto.startLatitude;
    booking.startLongitude = dto.startLongitude;
    booking.startAddress = dto.startAddress;
    booking.endAddress = dto.endAddress;
    booking.status = BookingStatus.PENDING;

    if (dto.isRental) {
      // Hourly Rental block
      const pkg = this.rentalPackages.find((p) => p.id === dto.rentalPackageId) || this.rentalPackages[0];
      booking.surgeMultiplier = 1.0;
      booking.carbonFootprintKg = Math.round(pkg.distanceKm * this.getCarbonEmissionFactor(dto.vehicleCategory) * 100) / 100;
      booking.vehicleCategory = dto.vehicleCategory; // <-- ADDED THIS LINE
      booking.routeCoordinates = this.generateRoutePoints(
        dto.startLatitude,
        dto.startLongitude,
        dto.startLatitude + 0.003,
        dto.startLongitude + 0.003
      );
      booking.customFare = dto.customFare || pkg.price;
    } else {
      // Dynamic Cab Ride block
      // Mock estimate details
      const distanceKm = 10;
      const categoryEstimate = {
        fare: dto.customFare || 150,
        carbonFootprintKg: Math.round(distanceKm * this.getCarbonEmissionFactor(dto.vehicleCategory) * 100) / 100,
      };
      const estimate = {
        routeCoordinates: this.generateRoutePoints(
          dto.startLatitude,
          dto.startLongitude,
          dto.startLatitude + 0.05,
          dto.startLongitude + 0.05
        ),
      };

      booking.carbonFootprintKg = categoryEstimate.carbonFootprintKg;
      booking.routeCoordinates = estimate.routeCoordinates;
      booking.vehicleCategory = dto.vehicleCategory; // <-- ADDED THIS LINE
      booking.customFare = categoryEstimate.fare;
      booking.surgeMultiplier = 1.0;

      if (dto.scheduledTime) {
        // Handle scheduling logic if needed
      }
    }

    return await this.bookingRepository.save(booking);
  }

  async getBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
}
