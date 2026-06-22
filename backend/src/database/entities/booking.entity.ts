import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';
import { Vehicle, VehicleCategory } from './vehicle.entity.js';

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  driverId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driverId' })
  driver?: User;

  @Column('float')
  startLatitude: number;

  @Column('float')
  startLongitude: number;

  @Column('float', { nullable: true })
  endLatitude?: number;

  @Column('float', { nullable: true })
  endLongitude?: number;

  @Column()
  startAddress: string;

  @Column({ nullable: true })
  endAddress?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column('float', { nullable: true })
  customFare?: number;

  @Column('float', { default: 1.0 })
  surgeMultiplier: number;

  @Column('float', { nullable: true })
  carbonFootprintKg?: number;

  @Column('simple-json', { nullable: true })
  routeCoordinates?: { lat: number; lng: number }[];

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  vehicleCategory?: VehicleCategory;

  @Column({ type: 'timestamp', nullable: true })
  pickupTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dropTime?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rentalType?: string; // HOURLY, DAILY, WEEKLY, MONTHLY

  @Column({ default: false })
  isSelfDrive: boolean;

  @Column({ default: false })
  emergencySOS: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @CreateDateColumn()
  createdAt: Date;
}
