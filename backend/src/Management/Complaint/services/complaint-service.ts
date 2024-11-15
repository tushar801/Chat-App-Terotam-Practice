// Service to handle complaint-related logic
import { AppDataSource } from '../../../config/dbconfig';
import { Complaint } from '../entities/Complaint';
import { Like, Repository } from 'typeorm';

export class ComplaintService {
  // Create Complaint
  static async createComplaint(complaintData: any) {
    try {
      const complaintRepo = AppDataSource.manager.getRepository(Complaint);
      const complaint = complaintRepo.create(complaintData);
      await complaintRepo.save(complaint);
      return complaint;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw new Error('Failed to create complaint');
    }
  }

  // Update Complaint (title, complaintType, description)
  static async updateComplaint(complaintId: number, updatedData: any) {
    try {
      const complaintRepo = AppDataSource.manager.getRepository(Complaint);
      const complaint = await complaintRepo.findOneBy({ id: complaintId });
      if (!complaint) {
        throw new Error('Complaint not found');
      }
      Object.assign(complaint, updatedData);  // Merge the updated fields into the complaint
      await complaintRepo.save(complaint);
      return complaint;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw new Error('Failed to update complaint');
    }
  }

  // Filter and Search Complaints including dynamic fields in formField array
  static async getFilteredComplaints(filterParams: any) {
    const { status, title, complaint_type, searchTerm } = filterParams;

    // Create the conditions for the WHERE clause dynamically
    const whereConditions: any = {};

    if (status) {
      whereConditions.status = status;  // Filter by status
    }
    if (title) {
      whereConditions.title = Like(`%${title}%`);  // Filter by title
    }
    if (complaint_type) {
      whereConditions.complaint_type = Like(`%${complaint_type}%`);  // Filter by complaint_type
    }

    // If searchTerm is provided, search across title, complaint_type and dynamic form fields
    if (searchTerm) {
      whereConditions.title = Like(`%${searchTerm}%`);
      whereConditions.complaint_type = Like(`%${searchTerm}%`);

      // Check dynamic fields within formField array
      whereConditions. form_fields_array = Like(`%${searchTerm}%`); // Match against dynamic fields in formField array
    }

    try {
      const complaintRepo = AppDataSource.manager.getRepository(Complaint);
      const complaints = await complaintRepo.find({
        where: whereConditions,
      });
      return complaints;
    } catch (error) {
      console.error('Error fetching filtered complaints:', error);
      throw new Error('Failed to fetch complaints');
    }
  }
}
