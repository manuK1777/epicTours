import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getChartData,
  addArtistToEvent,
  removeArtistFromEvent
} from '../controllers/eventController.js';
import { idValidator } from '../validations/generic.Validation.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get chart data
router.get('/chart-data', getChartData);

// Get event by ID
router.get('/:id', idValidator('id'), validate, getEventById);

// Create new event
router.post('/', createEvent);

// Update event
router.put('/:id', idValidator('id'), validate, updateEvent);

// Delete event
router.delete('/:id', idValidator('id'), validate, deleteEvent);

// Add artist to event
router.post('/:eventId/artists/:artistId', 
  idValidator('eventId'),
  idValidator('artistId'),
  validate,
  addArtistToEvent
);

// Remove artist from event
router.delete('/:eventId/artists/:artistId', 
  idValidator('eventId'),
  idValidator('artistId'),
  validate,
  removeArtistFromEvent
);

export default router;
