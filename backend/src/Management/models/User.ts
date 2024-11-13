import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';




@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    mobile: string;

    @Column({ unique: true })
    uniqueId: string;

    @Column()
    password: string;

    @Column({ default: 'superadmin' })
    role: string;  

    @Column({ default: true }) // Default value for isActive
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    
}