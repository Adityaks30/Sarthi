import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';
import { Vehicle } from './vehicle.entity.js';

export enum KYCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class DriverProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ default: false })
  isOnline: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    default: KYCStatus.PENDING,
  })
  kycStatus: KYCStatus;

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @Column('float', { default: 5.0 })
  rating: number;

  @Column({ nullable: true })
  vehicleId?: string;

  @OneToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;
}
