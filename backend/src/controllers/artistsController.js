import Artist from '../models/artistModel.js';
import Event from '../models/eventModel.js';
import Location from '../models/locationModel.js';
import Musician from '../models/musicianModel.js';
import Crew from '../models/crewModel.js';
import User from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleResponse, handleError } from '../utils/responseHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllArtists = async (req, res) => {
  try {
    const where = {};

    // If user is a manager, only show their artists
    if (req.user.role === 'manager') {
      where.user_id = req.user.id;
    }

    const artists = await Artist.findAll({
      where,
      include: [
        {
          model: Event,
          through: { attributes: [] },
          attributes: ['id', 'title', 'start_time'],
        },
        {
          model: Location,
          through: { attributes: [] },
          attributes: ['id', 'name', 'address'],
        },
        {
          model: Musician,
          attributes: ['id', 'name'],
        },
        {
          model: Crew,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    const artistsWithFile = artists.map((artist) => ({
      ...artist.toJSON(),
      file: artist.file || null,
    }));

    handleResponse(res, 200, 'Artists retrieved successfully', artistsWithFile);
  } catch (error) {
    handleError(res, error);
  }
};

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id, {
      include: [
        {
          model: Event,
          through: { attributes: [] },
          attributes: ['id', 'title', 'start_time'],
        },
        {
          model: Location,
          through: { attributes: [] },
          attributes: ['id', 'name', 'address'],
        },
        {
          model: Musician,
          attributes: ['id', 'name'],
        },
        {
          model: Crew,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    handleResponse(res, 200, 'Artist retrieved successfully', artist);
  } catch (error) {
    handleError(res, error);
  }
};

export const createArtist = async (req, res) => {
  try {
    const artistData = {
      ...req.body,
      file: req.file ? req.file.filename : null,
      user_id: req.user.role === 'manager' ? req.user.id : req.body.user_id,
    };

    const artist = await Artist.create(artistData);
    handleResponse(res, 201, 'Artist created successfully', artist);
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      fs.unlinkSync(filePath);
    }
    handleError(res, error);
  }
};

export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, webPage, contact, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const artist = await Artist.findByPk(id);
    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    if (file && artist.file) {
      const oldFilePath = path.join(__dirname, '../uploads', artist.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await artist.update({
      name: name || artist.name,
      email: email || artist.email,
      contact: contact || artist.contact,
      phone: phone || artist.phone,
      webPage: webPage || artist.webPage,
      file: file || artist.file,
    });

    handleResponse(res, 200, 'Artist updated successfully', artist);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    if (artist.file) {
      const filePath = path.join(__dirname, '../uploads', artist.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await artist.destroy();
    handleResponse(res, 200, 'Artist deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteArtistImage = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    if (!artist.file) {
      return handleResponse(res, 404, 'No image found for this artist');
    }

    const filePath = path.join(__dirname, '../uploads', artist.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await artist.update({ file: null });
    handleResponse(res, 200, 'Artist image deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const addVenueToArtist = async (req, res) => {
  try {
    const { artistId, venueId } = req.params;

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    const venue = await Location.findByPk(venueId);
    if (!venue) {
      return handleResponse(res, 404, 'Venue not found');
    }

    await artist.addVenue(venue);

    handleResponse(res, 200, 'Venue added to artist successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const removeVenueFromArtist = async (req, res) => {
  try {
    const { artistId, venueId } = req.params;

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    const venue = await Location.findByPk(venueId);
    if (!venue) {
      return handleResponse(res, 404, 'Venue not found');
    }

    await artist.removeVenue(venue);

    handleResponse(res, 200, 'Venue removed from artist successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getArtistEvents = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findByPk(artistId);

    if (!artist) {
      return handleResponse(res, 404, 'Artist not found');
    }

    // If user is a manager, check if they own this artist
    if (req.user.role === 'manager' && artist.user_id !== req.user.id) {
      return handleResponse(res, 403, 'Unauthorized access to this artist');
    }

    const events = await artist.getEvents({
      attributes: ['id', 'title', 'start_time', 'end_time', 'category'],
      order: [['start_time', 'DESC']],
    });

    handleResponse(res, 200, 'Events retrieved successfully', events);
  } catch (error) {
    handleError(res, error);
  }
};
