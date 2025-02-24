import express from 'express';
import {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  deleteArtistImage,
  addVenueToArtist,
  removeVenueFromArtist,
  getArtistEvents,
} from '../controllers/artistsController.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from '../middlewares/validate.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { checkArtistOwnership } from '../middlewares/checkResourceOwnership.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken(['admin', 'manager']));

// Get all artists
router.get('/', getAllArtists);

// Get artist by ID
router.get('/:id', idValidator('id'), validate, checkArtistOwnership, getArtistById);

// Get artist events
router.get('/:id/events', idValidator('id'), validate, checkArtistOwnership, getArtistEvents);

// Create new artist
router.post('/', upload.single('file'), createArtist);

// Update artist
router.put('/:id', idValidator('id'), upload.single('file'), checkArtistOwnership, updateArtist);

// Delete artist
router.delete('/:id', idValidator('id'), validate, checkArtistOwnership, deleteArtist);

// Delete artist image
router.delete('/:id/image', idValidator('id'), validate, checkArtistOwnership, deleteArtistImage);

// Add venue to artist
router.post(
  '/:artistId/venues/:venueId',
  idValidator('artistId'),
  idValidator('venueId'),
  validate,
  checkArtistOwnership,
  addVenueToArtist
);

// Remove venue from artist
router.delete(
  '/:artistId/venues/:venueId',
  idValidator('artistId'),
  idValidator('venueId'),
  validate,
  checkArtistOwnership,
  removeVenueFromArtist
);

export default router;
