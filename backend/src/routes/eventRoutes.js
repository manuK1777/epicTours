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
import { validateEventId } from '../middleware/validators.js';

const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get chart data
router.get('/chart-data', getChartData);

// Get event by ID
router.get('/:id', validateEventId, getEventById);

// Create new event
router.post('/', createEvent);

// Update event
router.put('/:id', validateEventId, updateEvent);

// Delete event
router.delete('/:id', validateEventId, deleteEvent);

// Add artist to event
router.post('/:eventId/artists/:artistId', addArtistToEvent);

// Remove artist from event
router.delete('/:eventId/artists/:artistId', removeArtistFromEvent);

export default router;
