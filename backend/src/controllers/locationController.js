import { validationResult } from 'express-validator';
import Location from '../models/locationModel.js';
import Contact from '../models/contactModel.js'; // Assuming related model

// Get All Locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: { model: Contact, as: 'contact' }, // Include associated contacts
    });

    res.status(200).json({
      code: 1,
      message: 'Locations retrieved successfully',
      data: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Get Location by ID
export const getLocationById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const location = await Location.findByPk(id, {
      include: { model: Contact, as: 'contact' }, // Include associated contacts
    });

    if (!location) {
      return res.status(404).json({ code: -6, message: 'Location not found' });
    }

    res.status(200).json({
      code: 1,
      message: 'Location detail retrieved successfully',
      data: location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

// Create New Location
export const createLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Received location data:', req.body);

    const { name, category, address, latitude, longitude, contact_id } = req.body;

    if (!address) {
      return res.status(400).json({ 
        error: 'Address is required',
        details: 'The address field cannot be empty'
      });
    }

    // Validate coordinates are numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ 
        error: 'Invalid coordinates',
        details: { latitude, longitude }
      });
    }

    const newLocation = await Location.create({
      name,
      category,
      address,
      latitude: lat,
      longitude: lng,
      contact_id: contact_id || null,
    });

    console.log('Created location:', newLocation.toJSON());

    res.status(201).json({
      code: 1,
      message: 'Location created successfully',
      data: newLocation,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ 
      error: 'Failed to create location',
      details: error.message 
    });
  }
};

// Update Existing Location
export const updateLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, category, address, latitude, longitude, contact_id } = req.body;

    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ code: -3, message: 'Location not found' });
    }

    await location.update({
      name: name || location.name,
      category: category || location.category,
      address: address || location.address,
      latitude: latitude || location.latitude,
      longitude: longitude || location.longitude,
      contact_id: contact_id || location.contact_id,
    });

    res.status(200).json({
      code: 1,
      message: 'Location updated successfully',
      data: location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// Delete Location
export const deleteLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({ code: -3, message: 'Location not found' });
    }

    await location.destroy();

    res.status(200).json({
      code: 1,
      message: 'Location deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Location.findAll({
      attributes: ['category'],
      group: ['category'], 
    });

    res.status(200).json(categories.map((c) => c.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

import { Op } from 'sequelize'; // Use Sequelize.Op instead of Sequelize directly

export const getLocationsByCategories = async (req, res) => {
  try {
    const { categories } = req.query; // Example: ?categories=Jazz,Rock
    const categoryArray = categories ? categories.split(',') : [];

    const locations = await Location.findAll({
      where: {
        category: {
          [Op.in]: categoryArray, // Use Op.in for filtering
        },
      },
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations by categories:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};
