import { Router } from "express";
import { param } from "express-validator";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getCategories,
  getLocationsByCategories
} from "../controllers/locationController.js";
import { validate } from "../middlewares/validate.js"; // Middleware to handle validation
import { locationValidator } from "../validations/location.Validation.js";

const router = Router();

// Routes for managing locations
router.get("/", getAllLocations);

router.post("/", locationValidator, validate, createLocation);

router.put(
  "/:id",
  [param("id").isInt().withMessage("Invalid location ID"), ...locationValidator],
  validate,
  updateLocation
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("Invalid location ID"),
  validate,
  deleteLocation
);

router.get('/categories', getCategories);
router.get('/filtered-locations', getLocationsByCategories);


export default router;
