import Contact from '../models/contact.js';
import HttpError from '../helpers/HttpError.js';

export const listContacts = async (
  userId,
  { page = 1, limit = 20, favorite } = {}
) => {
  const offset = (page - 1) * limit;
  const where = { owner: userId };
  if (favorite !== undefined) where.favorite = favorite;
  return await Contact.findAll({ where, offset, limit: Number(limit) });
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) throw HttpError(404, 'Contact not found');
  return contact;
};

export const removeContact = async (contactId, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) throw HttpError(404, 'Contact not found');
  await contact.destroy();
  return contact;
};

export const addContact = async (contactData, userId) => {
  const newContact = await Contact.create({ ...contactData, owner: userId });
  return newContact;
};

export const updateContact = async (contactId, body, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) throw HttpError(404, 'Contact not found');
  await contact.update(body);
  return contact;
};

export const updateStatusContact = async (contactId, favorite, userId) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) throw HttpError(404, 'Contact not found');
  await contact.update({ favorite });
  return contact;
};
