import { Router } from "express";
import * as ContactsController from "./modules/contacts/controller.js";

export const api = Router();

api.get("/contacts", ContactsController.getAllContacts);
api.get("/contacts/:id", ContactsController.getContactById);
api.post("/contacts", ContactsController.addContact);
api.delete("/contacts/:id", ContactsController.removeContact);
api.put("/contacts/:id", ContactsController.updateContact);
api.patch("/contacts/:id", ContactsController.updateStatusContact);
