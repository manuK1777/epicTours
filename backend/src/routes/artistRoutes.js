import express from 'express';
import { 
  getAllArtists, 
  getArtistById, 
  createArtist, 
  updateArtist, 
  deleteArtist,
  deleteArtistImage,
  addVenueToArtist,
  removeVenueFromArtist
} from '../controllers/artistsController.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from '../middlewares/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all artists
router.get('/', getAllArtists);

// Get artist by ID
router.get('/:id', idValidator('id'), validate, getArtistById);

// Create new artist
router.post('/', upload.single('file'), createArtist);

// Update artist
router.put('/:id', idValidator('id'), upload.single('file'), updateArtist);

// Delete artist
router.delete('/:id', idValidator('id'), validate, deleteArtist);

// Delete artist image
router.delete('/:id/image', idValidator('id'), validate, deleteArtistImage);

// Add venue to artist
router.post('/:artistId/venues/:venueId', 
  idValidator('artistId'), 
  idValidator('venueId'), 
  validate, 
  addVenueToArtist
);

// Remove venue from artist
router.delete('/:artistId/venues/:venueId', 
  idValidator('artistId'), 
  idValidator('venueId'), 
  validate, 
  removeVenueFromArtist
);

export default router;
