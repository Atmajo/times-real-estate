import { 
  addContact, 
  getContacts, 
  getContact, 
  updateContact, 
  deleteContact 
} from "@/controllers/contact/contactControllers";
import { Router } from "express";

const router = Router();

router.get("/", getContacts);
router.get("/:id", getContact);
router.post("/", addContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export { router as contactRouter };
