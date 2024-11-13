import { AppDataSource } from '../../../config/dbconfig';
import { Complaint } from '../entities/Complaint';
import { ComplaintHistory } from '../entities/ComplaintHistory';

export const complaintRepository = AppDataSource.getRepository(Complaint);
export const complaintHistoryRepository = AppDataSource.getRepository(ComplaintHistory);
