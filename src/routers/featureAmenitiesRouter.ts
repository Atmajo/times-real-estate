import { 
  addFeatureAmenities, 
  getFeatureAmenities, 
  getSingleFeatureAmenities, 
  updateFeatureAmenities, 
  deleteFeatureAmenities 
} from "@/controllers/featureAmenities/featureAmenitiesControllers";
import { Router } from "express";

const router = Router();

router.get("/", getFeatureAmenities);
router.get("/:id", getSingleFeatureAmenities);
router.post("/", addFeatureAmenities);
router.patch("/:id", updateFeatureAmenities);
router.delete("/:id", deleteFeatureAmenities);

export { router as featureAmenitiesRouter };
