import Location from '../models/locationModel.js';
import Contact from '../models/contactModel.js';
import { handleResponse, handleError } from '../utils/responseHelper.js';
import { Op } from 'sequelize';

// Get All Locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: { model: Contact, as: 'contact' }
    });

    handleResponse(res, 200, 'Locations retrieved successfully', locations);
  } catch (error) {
    handleError(res, error);
  }
};

// Get Location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id, {
      include: { model: Contact, as: 'contact' }
    });

    if (!location) {
      return handleResponse(res, 404, 'Location not found');
    }

    handleResponse(res, 200, 'Location retrieved successfully', location);
  } catch (error) {
    handleError(res, error);
  }
};

// Create New Location
export const createLocation = async (req, res) => {
  try {
    const { name, category, address, latitude, longitude, contact_id } = req.body;

    // Basic validation for required fields
    if (!address) {
      return handleResponse(res, 400, 'Address is required');
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return handleResponse(res, 400, 'Invalid coordinates', { latitude, longitude });
    }

    const newLocation = await Location.create({
      name,
      category,
      address,
      latitude: lat,
      longitude: lng,
      contact_id: contact_id || null,
    });

    handleResponse(res, 201, 'Location created successfully', newLocation);
  } catch (error) {
    handleError(res, error);
  }
};

// Update Existing Location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, address, latitude, longitude, contact_id } = req.body;

    const location = await Location.findByPk(id);
    if (!location) {
      return handleResponse(res, 404, 'Location not found');
    }

    await location.update({
      name: name || location.name,
      category: category || location.category,
      address: address || location.address,
      latitude: latitude || location.latitude,
      longitude: longitude || location.longitude,
      contact_id: contact_id || location.contact_id,
    });

    handleResponse(res, 200, 'Location updated successfully', location);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete Location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);

    if (!location) {
      return handleResponse(res, 404, 'Location not found');
    }

    await location.destroy();
    handleResponse(res, 200, 'Location deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Location.findAll({
      attributes: ['category'],
      group: ['category'],
    });

    handleResponse(res, 200, 'Categories retrieved successfully', categories.map((c) => c.category));
  } catch (error) {
    handleError(res, error);
  }
};

export const getLocationsByCategories = async (req, res) => {
  try {
    const { categories } = req.query;
    const categoryArray = categories ? categories.split(',') : [];

    const locations = await Location.findAll({
      where: {
        category: {
          [Op.in]: categoryArray,
        },
      },
    });

    handleResponse(res, 200, 'Locations retrieved successfully', locations);
  } catch (error) {
    handleError(res, error);
  }
};
