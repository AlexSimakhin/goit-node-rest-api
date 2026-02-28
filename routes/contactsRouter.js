import express from "express";
import {
  getAllContacts,
  getContact,
  deleteContact,
  createContact,
  updateContactById,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, getContact);

contactsRouter.delete("/:id", authMiddleware, deleteContact);

contactsRouter.post("/", authMiddleware, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authMiddleware, validateBody(updateContactSchema), updateContactById);

contactsRouter.patch("/:id/favorite", authMiddleware, validateBody(updateFavoriteSchema), updateStatusContact);

export default contactsRouter;
