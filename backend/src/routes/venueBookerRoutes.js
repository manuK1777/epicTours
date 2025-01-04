import { Router } from "express";
import { 
    getAllVenueBookers, 
    getVenueBookerById, 
    createVenueBooker, 
    updateVenueBooker, 
    deleteVenueBooker 
} from "../controllers/venueBookerController.js";
import { validate } from "../middlewares/validate.js";
import { venueBookerValidator } from "../validations/venueBooker.Validation.js";
import { idValidator } from "../validations/generic.Validation.js";

const router = Router();

// Routes for managing venue bookers
router.get("/", getAllVenueBookers);
router.get("/:id", idValidator('id'), validate, getVenueBookerById);
router.post("/", venueBookerValidator, validate, createVenueBooker);
router.put("/:id", idValidator('id'), venueBookerValidator, validate, updateVenueBooker);
router.delete("/:id", idValidator('id'), validate, deleteVenueBooker);

export default router;
