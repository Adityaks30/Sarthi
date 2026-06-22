import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  otpCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires?: Date;

  @Column({ unique: true, nullable: true })
  referralCode?: string;

  @Column({ nullable: true })
  referredBy?: string;

  @Column({ default: 0 })
  loyaltyPoints: number;
}
