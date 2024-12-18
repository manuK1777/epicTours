import { validationResult } from 'express-validator';
import Artist from '../models/artistModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllArtists = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artists = await Artist.findAll(); 
    const artistsWithfile = artists.map((artist) => ({
      ...artist.toJSON(),
      file: artist.file || null,
    }));

    res.status(200).json({
      code: 1,
      message: 'Artists List',
      data: artistsWithfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve artists' });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ code: -6, message: 'Artist not found' });
    }

    res.status(200).json({
      code: 1,
      message: 'Artist Detail',
      data: artist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve artist' });
  }
};

export const createArtist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, webPage, contact, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const newArtist = await Artist.create({
      name,
      email,
      webPage: webPage || null,
      contact,
      phone,
      file,
    });

    res.status(201).json({
      code: 1,
      message: 'Artist Added Successfully',
      data: newArtist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
};

export const updateArtist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, webPage, contact, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ code: -3, message: 'Artist not found' });
    }

    artist.name = name || artist.name;
    artist.email = email || artist.email;
    artist.contact = contact || artist.contact;
    artist.phone = phone || artist.phone;
    artist.webPage = webPage || artist.webPage;
    
    if (file) artist.file = file;

    await artist.save();

    res.status(200).json({
      code: 1,
      message: 'Artist Updated Successfully',
      data: artist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update artist' });
  }
};

export const deleteArtist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ code: -3, message: 'Artist not found' });
    }

    // Remove associated file if exists
    if (artist.file) {
      const filePath = path.join(__dirname, '../uploads', artist.file);
      console.log('File path to delete:', filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await artist.destroy();

    res.status(200).json({
      code: 1,
      message: 'Artist Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
};

// Delete Artist Image
export const deleteArtistImage = async (req, res) => {
  console.log('File deletion request:', req.params);
  
  try {
    const { id } = req.params;

    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ code: -3, message: 'Artist not found' });
    }

    // Remove file from disk if exists
    if (artist.file) {
      const filePath = path.join(__dirname, '../uploads', artist.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Update artist to remove file reference
    artist.file = null;
    await artist.save();

    res.status(200).json({
      code: 1,
      message: 'file deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};



