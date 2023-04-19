import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} from "./models/contacts.js";
import { Router } from "express";
import Joi from "joi";
import express from "express";
import logger from "morgan";
import cors from "cors";

export const contactsRouter = Router();
const app = express();

export default app;

const contactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Missing required name - field",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Missing required email - field",
  }),
  phone: Joi.string()
    .pattern(new RegExp("^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Please provide a phone number in the format (XXX) XXX-XXXX",
      "any.required": "Missing required phone - field",
    }),
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

contactsRouter.get("", async (req, res) => {
  const list = await listContacts();

  res.status(200).json(list);
});

contactsRouter.get("/:id", async (req, res) => {
  const requestContact = await getContactById(req.params.id);

  if (!requestContact) return res.status(404).send({ message: "Not found" });

  return res.status(200).json(requestContact);
});

contactsRouter.post("", async (req, res) => {
  const { error, value } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { name, email, phone } = value;

  const newContact = await addContact({ name, email, phone });

  return res.status(201).json(newContact);
});

contactsRouter.delete("/:id", async (req, res) => {
  const requestContact = await getContactById(req.params.id);
  const deleteContact = await removeContact(req.params.id);

  if (requestContact) {
    return res.status(200).json({ message: "contact deleted" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

contactsRouter.put("/:id", async (req, res) => {
  const { error, value } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { name, email, phone } = value;
  const { id } = req.params;
  const updatedContact = await updateContact(id, { name, email, phone });

  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});
