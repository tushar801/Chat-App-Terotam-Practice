import nodemailer from 'nodemailer';
import { AppDataSource } from '../../config/dbconfig';
import { User } from '../models/User';

export const notifySuperadmin = async (userEmail: string, role: string) => {
  try {
    // Finding the superadmin email using the DataSource
    const userRepository = AppDataSource.getRepository(User);
    const superadmin = await userRepository.findOne({ where: { role: 'superadmin' } });

    if (!superadmin) {
      throw new Error('Superadmin not found');
    }

   
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'tushar-email@gmail.com', 
        pass: 'password', 
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: superadmin.email, 
      subject: 'User Activation Notification',
      text: `User with email: ${userEmail} and role: ${role} is now active.`,
    };

    
    await transporter.sendMail(mailOptions);
    console.log('Email sent to Superadmin');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};
