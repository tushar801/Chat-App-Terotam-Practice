import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ComplaintHistory } from './ComplaintHistory';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  complaintType: string;

  @Column('text')
  description: string;

  @Column({ type: 'int', nullable: true })
  priority: number | null;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({ default: 'Upcoming' })
  status: string;

  @Column()
  complaint_userId: string;

  // One Complaint can have many ComplaintHistory records
  @OneToMany(() => ComplaintHistory, (history) => history.complaint)
  history: ComplaintHistory[];
}
