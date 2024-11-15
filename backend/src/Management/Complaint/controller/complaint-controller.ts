import { Request, Response } from 'express';
import { ComplaintService } from '../services/complaint-service';

export class ComplaintController {
  // Create Complaint
  static async createComplaint(req: Request, res: Response) {
    try {
      const { title, complaintType, description, complaint_userId,  form_fields_array } = req.body;
      
      // Ensure the complaint data is correct and create a new complaint
      const complaint = await ComplaintService.createComplaint({ title, complaintType, description, complaint_userId,  form_fields_array });
      
      if (!complaint) {
        return res.status(400).json({ error: 'Failed to create complaint' });
      }
      
      return res.status(201).json({ message: 'Complaint created successfully', data: complaint });
    } catch (error: any) {
      console.error('Error creating complaint:', error);
      return res.status(500).json({ error: error.message || 'Something went wrong while creating the complaint.' });
    }
  }

  // Update Complaint
  static async updateComplaint(req: Request, res: Response) {
    const { id } = req.params;
    const { title, complaintType, description,  form_fields_array } = req.body;

    // Ensure the ID is parsed as a number
    const complaintId = parseInt(id);
    if (isNaN(complaintId)) {
      return res.status(400).json({ error: 'Invalid complaint ID' });
    }

    try {
      const updatedComplaint = await ComplaintService.updateComplaint(complaintId, {
        title,
        complaintType,
        description,
         form_fields_array
      });
      res.status(200).json(updatedComplaint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Filter and Search Complaints
  static async getFilteredComplaintList(req: Request, res: Response) {
    try {
      const { status, title, complaint_type, searchTerm } = req.body;

      const filterParams = {
        status: status ? status : undefined,
        title: title ? title : undefined,
        complaint_type: complaint_type ? complaint_type : undefined,
        searchTerm: searchTerm ? searchTerm : undefined,
      };

      const complaints = await ComplaintService.getFilteredComplaints(filterParams);

      res.status(200).json(complaints);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
