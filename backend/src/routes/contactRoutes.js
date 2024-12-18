import { Router } from "express";
import { 
    getAllContacts, 
    getContactById, 
    createContact, 
    updateContact, 
    deleteContact 
} from "../controllers/contactController.js";
import { contactValidator } from "../validations/contact.Validation.js";
import { validate } from "../middlewares/validate.js";
import { idValidator } from "../validations/generic.Validation.js";

const router = Router();

router.get("/", getAllContacts); // Get all contacts
router.get("/:id", idValidator, validate, getContactById); // Get a contact by ID
router.post("/", contactValidator, validate, createContact); // Create a new contact
router.put("/:id", contactValidator, validate, updateContact); // Update an existing contact
router.delete("/:id", idValidator, validate, deleteContact); // Delete a contact

export default router;
