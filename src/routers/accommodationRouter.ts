import { addAccommodation } from "@/controllers/accommodation/addAccommodation";
import { deleteAccommodation } from "@/controllers/accommodation/deleteAccommodation";
import { getAccommodation } from "@/controllers/accommodation/getAccommodation";
import { getAccommodations } from "@/controllers/accommodation/getAccommodations";
import { updateAccommodation } from "@/controllers/accommodation/updateAccommodation";
import { Router } from "express";

const router = Router();

router.get("/", getAccommodations);
router.get("/:id", getAccommodation);
router.post("/", addAccommodation);
router.patch("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

export { router as accommodationRouter };
