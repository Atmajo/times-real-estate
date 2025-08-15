import { addProperty } from "@/controllers/property/addProperty";
import {
  getProperties,
  getProperty,
} from "@/controllers/property/getProperties";
import {
  updateProperty,
  deleteProperty,
} from "@/controllers/property/updateProperty";
import {
  searchPropertiesRedis,
  autocompletePropertiesEndpoint,
  getPropertySearchStats,
  syncPropertyEndpoint,
  syncAllProperty,
} from "@/controllers/property/searchProperties";
import { Router } from "express";

const router = Router();

// Regular CRUD operations
router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", addProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

// Fast search operations
router.get("/search/fast", searchPropertiesRedis);
router.get("/search/autocomplete", autocompletePropertiesEndpoint);
router.get("/search/stats", getPropertySearchStats);
router.get("/search/sync/all", syncAllProperty);
router.post("/search/sync/:propertyId", syncPropertyEndpoint);

export { router as propertyRouter };
