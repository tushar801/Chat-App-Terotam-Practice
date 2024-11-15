import { Router } from 'express';
import { ComplaintService } from '../services/complaint-service';
import { ComplaintController } from '../controller/complaint-controller';

const router = Router();

// Create Complaint
router.post('/complaint', async (req, res) => {
  try {
    const complaint = await ComplaintController.createComplaint(req, res);
    if (!complaint) {
      return res.status(400).json({ error: 'Failed to create complaint' });
    }
    res.status(201).json({ message: 'Complaint created successfully', data: complaint });
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: error.message || 'Something went wrong while creating the complaint.' });
  }
});

// Update Complaint (title, complaintType, description)
router.post('/complaint/:id', async (req, res) => {
  const { id } = req.params;
  const { title, complaintType, description, formField } = req.body;

  const complaintId = parseInt(id);
  if (isNaN(complaintId)) {
    return res.status(400).json({ error: 'Invalid complaint ID' });
  }

  try {
    const updatedComplaint = await ComplaintController.updateComplaint(req, res);
    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found or update failed' });
    }
    res.status(200).json({ message: 'Complaint updated successfully', data: updatedComplaint });
  } catch (error: any) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: error.message || 'Something went wrong while updating the complaint.' });
  }
});

// Filter and Search Complaints
router.post('/complaints/filter', async (req, res) => {
  try {
    const complaints = await ComplaintController.getFilteredComplaintList(req, res);
    res.status(200).json({ message: 'Complaints fetched successfully', data: complaints });
  } catch (error: any) {
    console.error('Error fetching filtered complaints:', error);
    res.status(500).json({ error: error.message || 'Something went wrong while fetching the complaints.' });
  }
});

export default router;
