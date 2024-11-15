import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Complaint } from './Complaint';

@Entity()
export class ComplaintHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Complaint, (complaint) => complaint.history) // Define the relation with Complaint
  @JoinColumn({ name: 'complaintId' }) // Define the foreign key column in this table
  complaint: Complaint;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column({ name: 'complaint_userId' })
  complaint_userId: string; // Track user who updated the complaint
}
