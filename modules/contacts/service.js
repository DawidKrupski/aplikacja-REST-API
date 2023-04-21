import { Contacts } from "./model.js";

export const getAll = () => Contacts.find({});

export const getByID = (id) => Contacts.findOne({ _id: id });

export const addContact = (name, email, phone) =>
  Contacts.create({ name, email, phone });

export const removeContact = (id) => Contacts.findByIdAndDelete({ _id: id });

export const updateContact = (id, contact) =>
  Contacts.findByIdAndUpdate({ _id: id }, contact, { new: true });

export const updateStatusContact = (id, { favorite }) =>
  Contacts.findByIdAndUpdate({ _id: id }, { favorite });
