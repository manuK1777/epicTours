import { validationResult } from 'express-validator';
import Crew from '../models/crewModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllCrewMembers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const crewMembers = await Crew.findAll();
    const crewMembersWithFile = crewMembers.map((crew) => ({
      ...crew.toJSON(),
      file: crew.file || null,
    }));

    res.status(200).json({
      code: 1,
      message: 'Crew Members List',
      data: crewMembersWithFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve crew members' });
  }
};

export const getCrewMemberById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const crewMember = await Crew.findByPk(id);
    if (!crewMember) {
      return res.status(404).json({ code: -6, message: 'Crew member not found' });
    }

    res.status(200).json({
      code: 1,
      message: 'Crew Member Detail',
      data: crewMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve crew member' });
  }
};

export const createCrewMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const newCrewMember = await Crew.create({
      name,
      email,
      phone,
      file,
    });

    res.status(201).json({
      code: 1,
      message: 'Crew Member Added Successfully',
      data: newCrewMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create crew member' });
  }
};

export const updateCrewMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, phone } = req.body;
    const file = req.file ? req.file.filename : null;

    const crewMember = await Crew.findByPk(id);
    if (!crewMember) {
      return res.status(404).json({ code: -3, message: 'Crew member not found' });
    }

    // If there's a new file and an existing file, delete the old one
    if (file && crewMember.file) {
      const oldFilePath = path.join(__dirname, '../../uploads', crewMember.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await crewMember.update({
      name,
      email,
      phone,
      file: file || crewMember.file,
    });

    res.status(200).json({
      code: 1,
      message: 'Crew Member Updated Successfully',
      data: crewMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update crew member' });
  }
};

export const deleteCrewMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const crewMember = await Crew.findByPk(id);

    if (!crewMember) {
      return res.status(404).json({ code: -3, message: 'Crew member not found' });
    }

    // Delete associated file if it exists
    if (crewMember.file) {
      const filePath = path.join(__dirname, '../../uploads', crewMember.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await crewMember.destroy();

    res.status(200).json({
      code: 1,
      message: 'Crew Member Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete crew member' });
  }
};

export const deleteCrewMemberImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const crewMember = await Crew.findByPk(id);

    if (!crewMember) {
      return res.status(404).json({ code: -3, message: 'Crew member not found' });
    }

    if (!crewMember.file) {
      return res.status(404).json({ code: -3, message: 'No image found for this crew member' });
    }

    const filePath = path.join(__dirname, '../../uploads', crewMember.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await crewMember.update({ file: null });

    res.status(200).json({
      code: 1,
      message: 'Crew Member Image Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete crew member image' });
  }
};