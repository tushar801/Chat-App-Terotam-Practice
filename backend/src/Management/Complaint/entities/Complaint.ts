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

  @Column({ type: 'varchar', nullable: true })
  trigger_time: string | null;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({ default: 'Upcoming' })
  status: string;

  @Column()
  complaint_userId: string;

  // Adding dynamic form fields array to store form data
  @Column('jsonb', { nullable: true })
  form_fields_array: { type: number; u_id: number; field_name: string }[];

  // One Complaint can have many ComplaintHistory records
  @OneToMany(() => ComplaintHistory, (history) => history.complaint)
  history: ComplaintHistory[];
}
