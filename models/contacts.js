import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsFilePath = path.join("models", "contacts.json");

export const listContacts = async () => {
  const data = await fs.readFile(contactsFilePath, "utf-8");
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts));
};

export const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...body };
  const updatedContacts = [...contacts, newContact];
  await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts));
  return newContact;
};

export const updateContact = async (contactId, body) => {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  const updatedContact = { ...contacts[index], ...body };
  contacts = contacts.map((contact, i) =>
    i === index ? updatedContact : contact
  );
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts));
  return updatedContact;
};
