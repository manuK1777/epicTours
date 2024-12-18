import { validationResult } from 'express-validator';
import Event from '../models/eventModel.js';
import { sequelize } from '../db.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
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
    console.log("ID:", id);
    
    const event = await Event.findByPk(id); 

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event retrieved successfully", event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to retrieve event" });
  }
};

export const createEvent = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ code: 0, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const { title, category, start_time, end_time, color } = req.body;

    const newEvent = await Event.create({
      title,
      category,
      start_time: new Date(start_time).toISOString(), 
      end_time: end_time ? new Date(end_time).toISOString() : null, 
      color,
    });

    res.status(201).json({ code: 1, message: 'Event created successfully', data: newEvent });
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

