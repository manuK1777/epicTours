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

// Routes for managing contacts
router.get("/", getAllContacts);
router.get("/:id", idValidator('id'), validate, getContactById);
router.post("/", contactValidator, validate, createContact);
router.put("/:id", idValidator('id'), contactValidator, validate, updateContact);
router.delete("/:id", idValidator('id'), validate, deleteContact);

export default router;
