import Contact from '../models/contact.js';

export const listContacts = async () => {
  return await Contact.findAll();
};

export const getContactById = async (contactId) => {
  return await Contact.findByPk(contactId);
};

export const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const addContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, body) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.update(body);
  return contact;
};

export const updateStatusContact = async (contactId, favorite) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.update({ favorite });
  return contact;
};
