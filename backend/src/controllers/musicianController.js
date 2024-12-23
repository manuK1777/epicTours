import { validationResult } from 'express-validator';
import Musician from '../models/musicianModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllMusicians = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const musicians = await Musician.findAll();
    const musiciansWithFile = musicians.map((musician) => ({
      ...musician.toJSON(),
      file: musician.file || null,
    }));

    res.status(200).json({
      code: 1,
      message: 'Musicians List',
      data: musiciansWithFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve musicians' });
  }
};

export const getMusicianById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const musician = await Musician.findByPk(id);
    if (!musician) {
      return res.status(404).json({ code: -6, message: 'Musician not found' });
    }

    res.status(200).json({
      code: 1,
      message: 'Musician Detail',
      data: musician,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve musician' });
  }
};

export const createMusician = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const newMusician = await Musician.create({
      name,
      email,
      phone,
      file,
    });

    res.status(201).json({
      code: 1,
      message: 'Musician Added Successfully',
      data: newMusician,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create musician' });
  }
};

export const updateMusician = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const musician = await Musician.findByPk(id);
    if (!musician) {
      return res.status(404).json({ code: -3, message: 'Musician not found' });
    }

    // If there's a new file and an existing file, delete the old one
    if (file && musician.file) {
      const oldFilePath = path.join(__dirname, '../../uploads', musician.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await musician.update({
      name,
      email,
      phone,
      file: file || musician.file,
    });

    res.status(200).json({
      code: 1,
      message: 'Musician Updated Successfully',
      data: musician,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update musician' });
  }
};

export const deleteMusician = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const musician = await Musician.findByPk(id);

    if (!musician) {
      return res.status(404).json({ code: -3, message: 'Musician not found' });
    }

    // Delete associated file if it exists
    if (musician.file) {
      const filePath = path.join(__dirname, '../../uploads', musician.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await musician.destroy();

    res.status(200).json({
      code: 1,
      message: 'Musician Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete musician' });
  }
};

export const deleteMusicianImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const musician = await Musician.findByPk(id);

    if (!musician) {
      return res.status(404).json({ code: -3, message: 'Musician not found' });
    }

    if (!musician.file) {
      return res.status(404).json({ code: -3, message: 'No image found for this musician' });
    }

    const filePath = path.join(__dirname, '../../uploads', musician.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await musician.update({ file: null });

    res.status(200).json({
      code: 1,
      message: 'Musician Image Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete musician image' });
  }
};