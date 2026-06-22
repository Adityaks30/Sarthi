import { VehicleCategory } from '../../database/entities/vehicle.entity.js';

export class CreateBookingDto {
  isRental?: boolean;
  startLatitude: number;
  startLongitude: number;
  endLatitude?: number;
  endLongitude?: number;
  startAddress: string;
  endAddress?: string;
  rentalPackageId?: string;
  vehicleCategory?: VehicleCategory;
  customFare?: number;
  scheduledTime?: string;
  couponCode?: string;
}
