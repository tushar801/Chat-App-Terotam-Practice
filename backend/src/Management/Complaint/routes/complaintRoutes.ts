import { Router } from 'express';
import { ComplaintService } from '../services/complaint-service';
import { ComplaintController } from '../controller/complaint-controller';

const router = Router();
const complaintService = new ComplaintService();
const complaintController = new ComplaintController();

// Create Complaint
router.post('/complaint', async (req, res) => {
  try {
    const complaint = await complaintService.createComplaint(req.body);
    res.status(201).json(complaint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Complaint (title, complaintType, description)
// Update Complaint (title, complaintType, description)
router.post('/complaint/:id', async (req, res) => {
  const { id } = req.params;
  const { title, complaintType, description} = req.body;

  // Ensure the ID is parsed as a number
  const complaintId = parseInt(id);
  if (isNaN(complaintId)) {
    return res.status(400).json({ error: 'Invalid complaint ID' });
  }

  try {
    // Update complaint fields like title, complaintType, description
    const updatedComplaint = await complaintService.updateComplaint(complaintId, {
      title,
      complaintType,
      description,
    });
    res.status(200).json(updatedComplaint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Filter/Search Complaints
router.get('/complaints/filter', complaintController.getFilteredComplaintList);

export default router;

