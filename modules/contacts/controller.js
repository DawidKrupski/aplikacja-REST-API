import * as ContactsService from "./service.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactsService.getAll();

    let filteredContacts = null;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (req.query.favorite === "true") {
      filteredContacts = contacts.filter((contact) => contact.favorite);
      return res.json(filteredContacts);
    }

    if (req.query.favorite === "false") {
      filteredContacts = contacts.filter((contact) => !contact.favorite);
      return res.json(filteredContacts);
    }

    if (req.query.page && req.query.limit) {
      const paginatedContacts = contacts.slice(startIndex, endIndex);
      return res.json(paginatedContacts);
    }

    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await ContactsService.getByID(id);

    if (!contact) return res.status(404).json({ message: "Not found" });

    return res.status(200).json({ contact });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Provided ID is not in the expected format" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) return res.status(400).json("Missing required name - field");

  const addedContact = await ContactsService.addContact(name, email, phone);

  return res.status(201).json(addedContact);
};

export const removeContact = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedContact = await ContactsService.removeContact(id);

    if (!deletedContact) return res.status(404).json({ message: "Not found" });

    return res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Provided ID is not in the expected format" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContact = async (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;
  try {
    if (!name)
      return res.status(400).json({ message: "Missing required name field" });

    const updatedContact = await ContactsService.updateContact(id, {
      name,
      email,
      phone,
    });

    if (!updatedContact) return res.status(404).json({ message: "Not found" });

    return res.status(200).json(updatedContact);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Provided ID is not in the expected format" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStatusContact = async (req, res) => {
  const id = req.params.id;
  const { favorite } = req.body;

  try {
    const updatedStatusContact = await ContactsService.updateStatusContact(id, {
      favorite,
    });

    if (!favorite)
      return res.status(400).json({ message: "Missing field favorite" });

    if (!updatedStatusContact)
      return res.status(404).json({ message: "Not found" });

    return res.status(200).json(updatedStatusContact);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Provided ID is not in the expected format" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
