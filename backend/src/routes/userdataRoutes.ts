import express from 'express';
import { handleFileGeneration } from '../controllers/userdataDownloadController';

const router = express.Router();

// Route to handle PDF and Excel generation
router.post('/generate', handleFileGeneration);

export default router;
