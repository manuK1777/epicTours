import { validationResult } from "express-validator";
import Contact from "../models/contactModel.js";

// Get all contacts
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.status(200).json({ data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};

// Get a contact by ID
export const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.status(200).json({ data: contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch contact" });
    }
};

// Create a new contact
export const createContact = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, phone, website, socialMedia } = req.body;
        const newContact = await Contact.create({ email, phone, website, socialMedia });
        res.status(201).json({ data: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create contact" });
    }
};

// Update an existing contact
export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phone, website, socialMedia } = req.body;

        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await contact.update({ email, phone, website, socialMedia });
        res.status(200).json({ data: contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update contact" });
    }
};

// Delete a contact
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await contact.destroy();
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete contact" });
    }
};
