import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum VehicleCategory {
  MINI = 'MINI',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  LUXURY = 'LUXURY',
}

export enum MaintenanceStatus {
  ACTIVE = 'ACTIVE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ unique: true })
  licensePlate: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  category: VehicleCategory;

  @Column({
    type: 'varchar',
    length: 20,
    default: MaintenanceStatus.ACTIVE,
  })
  maintenanceStatus: MaintenanceStatus;
}
