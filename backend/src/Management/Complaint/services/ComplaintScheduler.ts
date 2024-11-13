import cron from 'node-cron';
import { AppDataSource } from '../../../config/dbconfig';
import { Complaint } from '../entities/Complaint';
import { ComplaintHistory } from '../entities/ComplaintHistory';
import { logAction } from '../controller/logger';

export class ComplaintScheduler {
  static scheduleUpcomingComplaintsJob() {
    cron.schedule('*/30 * * * *', async () => {  // Runs every 30 minutes
      console.log('Checking for upcoming complaints...');

      try {
        const complaintRepo = AppDataSource.manager.getRepository(Complaint);
        const complaintHistoryRepo = AppDataSource.manager.getRepository(ComplaintHistory);

        // Fetch complaints with status 'Upcoming'
        const upcomingComplaints = await complaintRepo.find({
          where: { status: 'Upcoming' },
        });

        // Start a transaction
        await AppDataSource.transaction(async (transactionalEntityManager) => {
          for (const complaint of upcomingComplaints) {
            // Update complaint status and priority within transaction
            complaint.status = 'Pending';
            complaint.priority = null;
            await transactionalEntityManager.save(complaint);

            // Update status in ComplaintHistory table for the same complaint_userId
            await transactionalEntityManager
              .createQueryBuilder()
              .update(ComplaintHistory)
              .set({ status: 'Pending' })
              .where("complaint_userId = :userId AND status = 'Upcoming'", { userId: complaint.complaint_userId })
              .execute();

            // Log the action in MongoDB
            await logAction('Trigger', complaint.id, 'Complaint and related history status updated to Pending');
            console.log(`Complaint ID ${complaint.id} and related history records marked as Pending`);
          }
        });

        console.log('Upcoming complaints processed successfully');
      } catch (error) {
        console.error('Error processing complaints:', error);
      }
    });
  }
}
