import { Router } from 'express';
import { 
  getAllCrewMembers,
  getCrewMemberById,
  createCrewMember,
  updateCrewMember,
  deleteCrewMember,
  deleteCrewMemberImage,
} from '../controllers/crewController.js';
import { crewValidator } from '../validations/crew.Validation.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from "../middlewares/validate.js";
import { uploadFileMiddleware } from '../middlewares/upload.js';

const router = Router();

//Routes for managing crew members WITHOUT AUTHENTIFICATION
router.get('/', getAllCrewMembers); // Get all crew members
router.get('/:id', idValidator, validate, getCrewMemberById);
router.post('/', uploadFileMiddleware, crewValidator, validate, createCrewMember);
router.put('/:id', uploadFileMiddleware, idValidator, crewValidator, validate, updateCrewMember);
router.delete('/:id', idValidator, validate, deleteCrewMember);
router.delete('/:id/file', idValidator, validate, deleteCrewMemberImage);

export default router;
