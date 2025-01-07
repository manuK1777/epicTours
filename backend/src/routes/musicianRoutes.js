import { Router } from 'express';
import { 
  getAllMusicians,
  getMusicianById,
  getMusiciansByArtist,
  createMusician,
  updateMusician,
  deleteMusician,
  deleteMusicianImage,
} from '../controllers/musicianController.js';
import { musicianValidator } from '../validations/musician.Validation.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from "../middlewares/validate.js";
import upload from '../middlewares/upload.js';

const router = Router();

//Routes for managing musicians WITHOUT AUTHENTIFICATION
router.get('/', getAllMusicians); // Get all musicians
router.get('/artist/:artistId', idValidator('artistId'), validate, getMusiciansByArtist);
router.get('/:id', idValidator('id'), validate, getMusicianById);
router.post('/', upload.single('file'), musicianValidator, validate, createMusician);
router.put('/:id', upload.single('file'), idValidator('id'), musicianValidator, validate, updateMusician);
router.delete('/:id', idValidator('id'), validate, deleteMusician);
router.delete('/:id/file', idValidator('id'), validate, deleteMusicianImage);

export default router;
