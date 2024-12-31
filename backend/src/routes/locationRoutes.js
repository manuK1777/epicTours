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

const router = Router();

// Routes for managing locations
router.get("/", getAllLocations);

// Get locations by categories
router.get("/categories", getCategories);

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
