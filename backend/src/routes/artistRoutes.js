import { Router } from 'express';
import { 
  getAllArtists, 
  getArtistById, 
  createArtist, 
  updateArtist, 
  deleteArtist,
  deleteArtistImage, 
} from '../controllers/artistsController.js';
import { artistValidator } from '../validations/artist.Validation.js'; 
import { idValidator } from '../validations/generic.Validation.js'; 
import { validate } from "../middlewares/validate.js";
import { uploadFileMiddleware } from '../middlewares/upload.js'; 


const router = Router();

//Routes for managing artists WITHOUT AUTHENTIFICATION
router.get('/', getAllArtists); // Get all artists
router.get('/:id', idValidator, validate, getArtistById); 
router.post('/', uploadFileMiddleware, artistValidator, validate, createArtist 
);
router.put('/:id', uploadFileMiddleware, (req, res, next) => {
  next();
}, idValidator, artistValidator, validate, updateArtist);
router.delete('/:id', validate, idValidator, validate, deleteArtist); 
router.delete('/:id/file', validate, idValidator, validate, deleteArtistImage); // Ensure this matches the intended endpoint


export default router;


