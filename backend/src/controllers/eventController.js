import { validationResult } from 'express-validator';
import Event from '../models/eventModel.js';
import Artist from '../models/artistModel.js';
import Location from '../models/locationModel.js';
import { sequelize } from '../db.js';
import { handleResponse, handleError } from '../utils/responseHelper.js';

export const getAllEvents = async (req, res) => {
  try {
    let queryOptions = {
      include: [
        {
          model: Location,
          as: 'venue',
          attributes: ['id', 'name', 'address']
        },
        {
          model: Artist,
          through: { attributes: [] }, // Exclude junction table attributes
          attributes: ['id', 'name', 'user_id']
        }
      ]
    };

    // If user is a manager, only show events for their artists
    if (req.user && req.user.role === 'manager') {
      queryOptions.include[1].where = {
        user_id: req.user.id
      };
    }

    const events = await Event.findAll(queryOptions);

    handleResponse(res, 200, 'Events retrieved successfully', events);
  } catch (error) {
    handleError(res, error);
  }
};

export const getChartData = async (req, res) => {
  try {
    // Events by category
    const eventsByCategory = await Event.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count'],
      ],
      group: ['category'],
    });

    // Events over time
    const eventsOverTime = await Event.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('start_time'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('start_time')), 'count'],
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('start_time'), '%Y-%m')],
    });

    handleResponse(res, 200, 'Chart data retrieved successfully', {
      eventsByCategory,
      eventsOverTime,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        {
          model: Location,
          as: 'venue',
          attributes: ['id', 'name', 'address']
        },
        {
          model: Artist,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!event) {
      return handleResponse(res, 404, 'Event not found');
    }
    
    handleResponse(res, 200, 'Event retrieved successfully', event);
  } catch (error) {
    handleError(res, error);
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, category, start_time, end_time, venue_id, artist_ids = [] } = req.body;
    
    const event = await Event.create({
      title,
      category,
      start_time,
      end_time,
      venue_id
    });

    if (artist_ids.length > 0) {
      await event.setArtists(artist_ids);
    }

    const eventWithRelations = await Event.findByPk(event.id, {
      include: [
        {
          model: Location,
          as: 'venue',
          attributes: ['id', 'name', 'address']
        },
        {
          model: Artist,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    handleResponse(res, 201, 'Event created successfully', eventWithRelations);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateEvent = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return handleResponse(res, 400, 'Validation errors', errors.array());
  }

  try {
    const { id } = req.params;
    const { title, category, start_time, end_time, color } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return handleResponse(res, 404, 'Event not found');
    }

    await event.update({
      title,
      category,
      start_time: new Date(start_time).toISOString(), // Ensure UTC
      end_time: end_time ? new Date(end_time).toISOString() : null, 
      color,
    });

    handleResponse(res, 200, 'Event updated successfully', event);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return handleResponse(res, 404, 'Event not found');
    }

    await event.destroy();
    handleResponse(res, 200, 'Event deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const addArtistToEvent = async (req, res) => {
  try {
    const { eventId, artistId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      return handleResponse(res, 404, 'Event not found');
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    await event.addArtist(artist);
    
    handleResponse(res, 200, 'Artist added to event successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const removeArtistFromEvent = async (req, res) => {
  try {
    const { eventId, artistId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      return handleResponse(res, 404, 'Event not found');
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    await event.removeArtist(artist);
    
    handleResponse(res, 200, 'Artist removed from event successfully');
  } catch (error) {
    handleError(res, error);
  }
};
