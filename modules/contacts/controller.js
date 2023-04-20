import * as ContactsService from "./service.js";

export const getAllContacts = async (req, res) => {
  const contacts = await ContactsService.getAll();
  return res.json({ contacts });
};

export const getContactById = async (req, res) => {
  const id = req.params.id;
  const contact = await ContactsService.getByID(id);

  if (!contact) return res.status(404).send({ message: "Not found" });

  return res.status(200).json({ contact });
};

export const addContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) return res.status(400).json("Missing required name - field");

  const addedContact = await ContactsService.addContact(name, email, phone);

  return res.status(201).json(addedContact);
};

export const removeContact = async (req, res) => {
  const id = req.params.id;

  const deletedContact = await ContactsService.removeContact(id);

  if (!deletedContact) return res.status(404).json({ message: "Not found" });

  return res.status(200).json({ message: "contact deleted" });
};

export const updateContact = async (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  if (!name)
    return res.status(400).json({ message: "Missing required name field" });

  const updatedContact = await ContactsService.updateContact(id, {
    name,
    email,
    phone,
  });

  if (!updatedContact) return res.status(404).json({ message: "Not found" });

  return res.status(200).json(updatedContact);
};

export const updateStatusContact = async (req, res) => {
  const id = req.params.id;

  const { favorite } = req.body;

  const updatedStatusContact = await ContactsService.updateStatusContact(id, {
    favorite,
  });

  if (!favorite)
    return res.status(400).json({ message: "Missing field favorite" });

  if (!updatedStatusContact)
    return res.status(404).json({ message: "Not found" });

  return res.status(200).json(updatedStatusContact);
};
