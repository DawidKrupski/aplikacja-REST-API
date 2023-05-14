import { Router } from "express";
import * as ContactsController from "./modules/contacts/controller.js";
import * as UsersController from "./modules/users/controller.js";
import { auth, upload } from "./modules/users/middlewares.js";

export const api = Router();

api.get("/contacts", ContactsController.getAllContacts);
api.get("/contacts/:id", ContactsController.getContactById);
api.post("/contacts", ContactsController.addContact);
api.delete("/contacts/:id", ContactsController.removeContact);
api.put("/contacts/:id", ContactsController.updateContact);
api.patch("/contacts/:id", ContactsController.updateStatusContact);

api.post("/users/signup", UsersController.userRegister);
api.post("/users/login", UsersController.userLogin);
api.get("/users/logout", auth, UsersController.userLogout);
api.get("/users/current", auth, UsersController.userCurrent);
api.patch("/users", auth, UsersController.userSubscription);
api.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  UsersController.userAvatar
);
api.get("/users/verify/:verificationToken", UsersController.userVerify);
api.post("/users/verify", UsersController.reVerification);
