import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { config } from 'dotenv';
import { Migrations1728182901030 } from '../migrations/1728182901030-migrations';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  port: Number(process.env.DB_PORT) || 5432, 
  username: process.env.DB_USERNAME,
  password: 'password123', 
  database: process.env.DB_NAME, 
  entities: [User],
  synchronize: false, 
  migrations: [Migrations1728182901030],
  logging: true,
});


AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
