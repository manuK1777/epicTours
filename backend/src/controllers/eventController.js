import { validationResult } from 'express-validator';
import Event from '../models/eventModel.js';
import Artist from '../models/artistModel.js';
import Location from '../models/locationModel.js';
import { sequelize } from '../db.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Location,
          as: 'Venue',
          attributes: ['id', 'name', 'address']
        },
        {
          model: Artist,
          through: { attributes: [] }, // Exclude junction table attributes
          attributes: ['id', 'name']
        }
      ]
    });
    res.status(200).json({ code: 1, message: 'Events retrieved successfully', data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ code: 0, message: 'Error fetching events' });
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

    res.status(200).json({
      code: 1,
      message: 'Chart data retrieved successfully',
      data: {
        eventsByCategory,
        eventsOverTime,
      },
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ code: 0, message: 'Error fetching chart data' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        {
          model: Location,
          as: 'Venue',
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
      return res.status(404).json({ code: 0, message: 'Event not found' });
    }
    
    res.status(200).json({ code: 1, message: 'Event retrieved successfully', data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ code: 0, message: 'Error fetching event' });
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
          as: 'Venue',
          attributes: ['id', 'name', 'address']
        },
        {
          model: Artist,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({ code: 1, message: 'Event created successfully', data: eventWithRelations });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ code: 0, message: 'Error creating event' });
  }
};

export const updateEvent = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ code: 0, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, category, start_time, end_time, color } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ code: 0, message: 'Event not found' });
    }

    await event.update({
      title,
      category,
      start_time: new Date(start_time).toISOString(), // Ensure UTC
      end_time: end_time ? new Date(end_time).toISOString() : null, 
      color,
    });

    res.status(200).json({ code: 1, message: 'Event updated successfully', data: event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ code: 0, message: 'Error updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ code: 0, message: 'Event not found' });
    }

    await event.destroy();
    res.status(200).json({ code: 1, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ code: 0, message: 'Error deleting event' });
  }
};

export const addArtistToEvent = async (req, res) => {
  try {
    const { eventId, artistId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ code: 0, message: 'Event not found' });
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ code: 0, message: 'Artist not found' });
    }

    await event.addArtist(artist);
    
    res.status(200).json({ code: 1, message: 'Artist added to event successfully' });
  } catch (error) {
    console.error('Error adding artist to event:', error);
    res.status(500).json({ code: 0, message: 'Error adding artist to event' });
  }
};

export const removeArtistFromEvent = async (req, res) => {
  try {
    const { eventId, artistId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ code: 0, message: 'Event not found' });
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ code: 0, message: 'Artist not found' });
    }

    await event.removeArtist(artist);
    
    res.status(200).json({ code: 1, message: 'Artist removed from event successfully' });
  } catch (error) {
    console.error('Error removing artist from event:', error);
    res.status(500).json({ code: 0, message: 'Error removing artist from event' });
  }
};
