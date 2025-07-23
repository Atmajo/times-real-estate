import { addProperty } from "@/controllers/property/addProperty";
import { getProperties, getProperty } from "@/controllers/property/getProperties";
import { updateProperty, deleteProperty } from "@/controllers/property/updateProperty";
import { Router } from "express";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", addProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export { router as propertyRouter };
