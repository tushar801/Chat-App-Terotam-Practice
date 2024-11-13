import { Request, Response } from 'express';
import { ComplaintService } from '../services/complaint-service';

export class ComplaintController {
  private complaintService: ComplaintService;

  constructor() {
    this.complaintService = new ComplaintService();
  }

  // POST route for creating a complaint
  createComplaint = async (req: Request, res: Response) => {
    const { title, complaintType, description, priority, date, time, complaint_userId } = req.body;
    try {
      const result = await this.complaintService.createComplaint({
        title,
        complaintType,
        description,
        priority,
        date,
        time,
        complaint_userId,
      });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // PUT route for updating complaint fields (title, complaintType, description)
  updateComplaint = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, complaintType, description } = req.body; // Ensure required fields are passed
    try {
      const result = await this.complaintService.updateComplaint(parseInt(id), {
        title,
        complaintType,
        description,
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // GET route for filtering complaints
   async getFilteredComplaintList(req: Request, res: Response): Promise<void> {
    try {
      const complaints = await this.complaintService.getFilteredComplaintList(req.body);
      res.status(200).json(complaints);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

