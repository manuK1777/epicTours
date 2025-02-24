import { Router } from "express";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getCategories,
  getLocationsByCategories
} from "../controllers/locationController.js";
import { validate } from "../middlewares/validate.js";
import { locationValidator } from "../validations/location.Validation.js";
import { idValidator } from "../validations/generic.Validation.js";
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken(['admin', 'manager']));

// Routes for managing locations
router.get("/", getAllLocations);

// Get locations by categories
router.get("/categories", getCategories);

// Get locations filtered by categories
router.get("/filtered-locations", getLocationsByCategories);

router.post("/", locationValidator, validate, createLocation);

router.put("/:id",
  idValidator('id'),
  locationValidator,
  validate,
  updateLocation
);

router.delete("/:id",
  idValidator('id'),
  validate,
  deleteLocation
);

export default router;
