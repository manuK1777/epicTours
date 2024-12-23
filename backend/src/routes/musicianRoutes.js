import { Router } from 'express';
import { 
  getAllMusicians,
  getMusicianById,
  createMusician,
  updateMusician,
  deleteMusician,
  deleteMusicianImage,
} from '../controllers/musicianController.js';
import { musicianValidator } from '../validations/musician.Validation.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from "../middlewares/validate.js";
import { uploadFileMiddleware } from '../middlewares/upload.js';

const router = Router();

//Routes for managing musicians WITHOUT AUTHENTIFICATION
router.get('/', getAllMusicians); // Get all musicians
router.get('/:id', idValidator, validate, getMusicianById);
router.post('/', uploadFileMiddleware, musicianValidator, validate, createMusician);
router.put('/:id', uploadFileMiddleware, idValidator, musicianValidator, validate, updateMusician);
router.delete('/:id', idValidator, validate, deleteMusician);
router.delete('/:id/file', idValidator, validate, deleteMusicianImage);

export default router;
