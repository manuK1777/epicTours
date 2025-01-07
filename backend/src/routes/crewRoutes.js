import { Router } from 'express';
import { 
  getAllCrewMembers,
  getCrewMemberById,
  createCrewMember,
  updateCrewMember,
  deleteCrewMember,
  deleteCrewMemberImage,
  getCrewMembersByArtist
} from '../controllers/crewController.js';
import { crewValidator } from '../validations/crew.Validation.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from "../middlewares/validate.js";
import upload from '../middlewares/upload.js';

const router = Router();

//Routes for managing crew members WITHOUT AUTHENTIFICATION
router.get('/', getAllCrewMembers); // Get all crew members
router.get('/artist/:artistId', idValidator('artistId'), validate, getCrewMembersByArtist);
router.get('/:id', idValidator('id'), validate, getCrewMemberById);
router.post('/', upload.single('file'), crewValidator, validate, createCrewMember);
router.put('/:id', upload.single('file'), idValidator('id'), crewValidator, validate, updateCrewMember);
router.delete('/:id', idValidator('id'), validate, deleteCrewMember);
router.delete('/:id/file', idValidator('id'), validate, deleteCrewMemberImage);

export default router;
