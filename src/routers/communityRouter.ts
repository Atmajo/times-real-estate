import { addCommunity } from "@/controllers/community/addCommunity";
import { deleteCommunity } from "@/controllers/community/deleteCommunity";
import { getCommunity } from "@/controllers/community/getCommunity";
import { getCommunities } from "@/controllers/community/getCommunities";
import { updateCommunity } from "@/controllers/community/updateCommunity";
import { Router } from "express";

const router = Router();

router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.post("/", addCommunity);
router.patch("/:id", updateCommunity);
router.delete("/:id", deleteCommunity);

export { router as communityRouter };
