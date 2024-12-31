import Contact from '../models/contactModel.js';
import { handleResponse, handleError } from '../utils/responseHelper.js';

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    handleResponse(res, 200, 'Contacts retrieved successfully', contacts);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return handleResponse(res, 404, 'Contact not found');
    }

    handleResponse(res, 200, 'Contact retrieved successfully', contact);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new contact
export const createContact = async (req, res) => {
  try {
    const { email, phone, website, socialMedia } = req.body;
    const newContact = await Contact.create({ email, phone, website, socialMedia });
    handleResponse(res, 201, 'Contact created successfully', newContact);
  } catch (error) {
    handleError(res, error);
  }
};

// Update an existing contact
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, website, socialMedia } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return handleResponse(res, 404, 'Contact not found');
    }

    await contact.update({ email, phone, website, socialMedia });
    handleResponse(res, 200, 'Contact updated successfully', contact);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return handleResponse(res, 404, 'Contact not found');
    }

    await contact.destroy();
    handleResponse(res, 200, 'Contact deleted successfully');
  } catch (error) {
    handleError(res, error);
  }
};
