import cron from 'node-cron';
import { AppDataSource } from '../../../config/dbconfig';
import { Complaint } from '../entities/Complaint';
import { ComplaintHistory } from '../entities/ComplaintHistory';
import { logAction } from '../controller/logger';
import { LessThanOrEqual } from 'typeorm';
import moment from 'moment';

export class ComplaintScheduler {
  static scheduleUpcomingComplaintsJob() {
    cron.schedule('*/30 * * * *', async () => { // Runs every 30 minutes
      console.log('Checking for complaints ready to be activated...');

      try {
        const complaintRepo = AppDataSource.manager.getRepository(Complaint);
        const complaintHistoryRepo = AppDataSource.manager.getRepository(ComplaintHistory);

        // Get the current time
        const currentTime = moment().toISOString();

        // Fetch complaints with status 'Upcoming' and a trigger_time that has passed or is equal to the current time
        const upcomingComplaints = await complaintRepo.find({
          where: {
            status: 'Upcoming',
            trigger_time: LessThanOrEqual(currentTime),
          },
        });

        if (upcomingComplaints.length === 0) {
          console.log('No upcoming complaints found with trigger_time ready for activation.');
          return;
        }

        // Start a transaction
        await AppDataSource.transaction(async (transactionalEntityManager) => {
          for (const complaint of upcomingComplaints) {
            // Update complaint status and trigger_time within transaction
            complaint.status = 'Active';
            complaint.trigger_time = null;
            await transactionalEntityManager.save(complaint);

            // Update status in ComplaintHistory table for the same complaint_userId
            await transactionalEntityManager
              .createQueryBuilder()
              .update(ComplaintHistory)
              .set({ status: 'Active' })
              .where("complaint_userId = :userId AND status = 'Upcoming'", { userId: complaint.complaint_userId })
              .execute();

            // Log the action in MongoDB
            await logAction('Activate', complaint.id, 'Complaint and history table status updated to Active');
            console.log(`Complaint ID ${complaint.id} and related history table records marked as Active`);
          }
        });

        console.log('Complaints ready for activation processed successfully');
      } catch (error) {
        console.error('Error processing complaints:', error);
      }
    });
  }
}
