import VenueBooker from '../models/venueBookerModel.js';
import { handleResponse, handleError } from '../utils/responseHelper.js';

// Get all venue bookers
export const getAllVenueBookers = async (req, res) => {
  try {
    const venueBookers = await VenueBooker.findAll();
    handleResponse(res, 200, 'Venue bookers retrieved successfully', venueBookers);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a venue booker by ID
export const getVenueBookerById = async (req, res) => {
  try {
    const { id } = req.params;
    const venueBooker = await VenueBooker.findByPk(id);

    if (!venueBooker) {
      return handleResponse(res, 404, 'Venue booker not found');
    }

    handleResponse(res, 200, 'Venue booker retrieved successfully', venueBooker);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new venue booker
export const createVenueBooker = async (req, res) => {
  try {
    const { name, email, phone} = req.body;
    const newVenueBooker = await VenueBooker.create({ name, email, phone, website, socialMedia });
    handleResponse(res, 201, 'Venue booker created successfully', newVenueBooker);
  } catch (error) {
    handleError(res, error);
  }
};

// Update an existing venue booker
export const updateVenueBooker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone} = req.body;

    const venueBooker = await VenueBooker.findByPk(id);
    if (!venueBooker) {
      return handleResponse(res, 404, 'Venue booker not found');
    }

    await venueBooker.update({ name, email, phone });
    handleResponse(res, 200, 'Venue booker updated successfully', venueBooker);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a venue booker
export const deleteVenueBooker = async (req, res) => {
  try {
    const { id } = req.params;
    const venueBooker = await VenueBooker.findByPk(id);

    if (!venueBooker) {
      return handleResponse(res, 404, 'Venue booker not found');
    }

    await venueBooker.destroy();
    handleResponse(res, 200, 'Venue booker deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};
