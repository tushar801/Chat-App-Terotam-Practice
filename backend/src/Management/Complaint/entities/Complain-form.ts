import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ComplaintForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'complaint' })
  form_name: string;

  // Use 'jsonb' to store dynamic data in an array format
  @Column('jsonb', { default: [] })
  form_fields_array: { name: string, detail: string }[];  // Can store multiple fields
}
