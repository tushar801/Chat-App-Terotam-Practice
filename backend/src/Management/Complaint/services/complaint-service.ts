import { AppDataSource } from '../../../config/dbconfig';
import { Complaint } from '../entities/Complaint';
import { ComplaintHistory } from '../entities/ComplaintHistory';
import { logAction } from '../controller/logger';

export class ComplaintService {
  // Create new complaint and add initial history with logging
  async createComplaint(data: {
    title: string;
    complaintType: string;
    description: string;
    priority: number;
    date: string;
    time: string;
    complaint_userId: string;
  }) {
    const complaintRepository = AppDataSource.getRepository(Complaint);
    const historyRepository = AppDataSource.getRepository(ComplaintHistory);

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      const newComplaint = complaintRepository.create({
        ...data,
        complaint_userId: data.complaint_userId,
        status: 'Upcoming', // Default status on creation
      });
      const savedComplaint = await transactionalEntityManager.save(newComplaint);

      const complaintHistory = historyRepository.create({
        complaint: savedComplaint,
        title: 'Initial complaint state',
        status: savedComplaint.status,
        complaint_userId: data.complaint_userId,
      });

      await transactionalEntityManager.save(complaintHistory);
      await logAction('Create', savedComplaint.id, 'Complaint created with initial status "Upcoming"');

      return savedComplaint;
    });
  }

  // Update complaint fields (title, complaintType, description)
  // Update complaint fields (title, complaintType, description)
async updateComplaint(complaintId: number, updateData: {
  title?: string;
  complaintType?: string;
  description?: string;
}) {
  const complaintRepository = AppDataSource.getRepository(Complaint);
  const historyRepository = AppDataSource.getRepository(ComplaintHistory);

  return await AppDataSource.transaction(async (transactionalEntityManager) => {
    // Ensure that the ID is valid
    if (isNaN(complaintId)) {
      throw new Error('Invalid complaint ID');
    }

    const complaint = await transactionalEntityManager.findOne(Complaint, { where: { id: complaintId } });
    if (!complaint) {
      throw new Error(`Complaint with ID ${complaintId} not found`);
    }

    if (updateData.title) complaint.title = updateData.title;
    if (updateData.complaintType) complaint.complaintType = updateData.complaintType;
    if (updateData.description) complaint.description = updateData.description;

    await transactionalEntityManager.save(complaint);

    const complaintHistory = historyRepository.create({
      complaint: complaint,
      title: 'Complaint updated',
      status: complaint.status, // Keep the same status
      complaint_userId: complaint.complaint_userId,
    });

    await transactionalEntityManager.save(complaintHistory);
    await logAction('Update', complaintId, 'Complaint updated with new title, complaint type, or description');

    return complaint;
  });
}

  // Filter and Search complaints based on title, complaintType, and status (POST request)
  async getFilteredComplaintList(query: { title?: string; complaintType?: string; status?: string }) {
    const complaintRepository = AppDataSource.getRepository(Complaint);

    const where: any = {};

    // Add filters to the query condition if provided
    if (query.title) {
      where.title = { $ilike: `%${query.title}%` }; // Case-insensitive search for title
    }
    if (query.complaintType) {
      where.complaintType = { $ilike: `%${query.complaintType}%` }; // Case-insensitive search for complaintType
    }
    if (query.status) {
      where.status = query.status; // Exact match for status
    }

    console.log('Query where condition:', where); // Log query to check correctness

    try {
      // Fetch complaints based on the filters
      const complaints = await complaintRepository.find({
        where,
      });


      return complaints;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw new Error('Failed to fetch complaints');
    }
  }
}