import { DataSource } from 'typeorm';
import { User } from '../Management/models/User';
import { config } from 'dotenv';
import { Migrations1728182901030 } from '../Management/migrations/1728182901030-migrations';
import mongoose from 'mongoose';
import { Complaint } from '../Management/Complaint/entities/Complaint';
import { ComplaintHistory } from '../Management/Complaint/entities/ComplaintHistory';
import { CreateComplaintTable1647649200000 } from '../Management/Complaint/migrations/complaint-table';
import { CreateComplaintHistoryTable1647649200001 } from '../Management/Complaint/migrations/complaint-history-table';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  port: Number(process.env.DB_PORT) || 5432, 
  username: process.env.DB_USERNAME,
  password: 'password123', 
  database: process.env.DB_NAME, 
  entities: [User, Complaint, ComplaintHistory],
  synchronize: false, 
  migrations: [Migrations1728182901030, CreateComplaintTable1647649200000, CreateComplaintHistoryTable1647649200001 ],
  logging: true,
});



AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

  export const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/complaintsLog');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
