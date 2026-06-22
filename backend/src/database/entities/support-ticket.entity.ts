import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  category: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column('text', { nullable: true })
  adminReply?: string;

  @CreateDateColumn()
  createdAt: Date;
}
