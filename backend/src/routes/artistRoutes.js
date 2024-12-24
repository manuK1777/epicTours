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
import { validateArtistId } from '../middleware/validators.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all artists
router.get('/', getAllArtists);

// Get artist by ID
router.get('/:id', validateArtistId, getArtistById);

// Create new artist
router.post('/', upload.single('file'), createArtist);

// Update artist
router.put('/:id', validateArtistId, upload.single('file'), updateArtist);

// Delete artist
router.delete('/:id', validateArtistId, deleteArtist);

// Delete artist image
router.delete('/:id/image', validateArtistId, deleteArtistImage);

// Add venue to artist
router.post('/:artistId/venues/:venueId', addVenueToArtist);

// Remove venue from artist
router.delete('/:artistId/venues/:venueId', removeVenueFromArtist);

export default router;
