import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const userId = req.user.id;
    const result = await contactsService.listContacts(userId, {
      page: Number(page),
      limit: Number(limit),
      favorite: favorite !== undefined ? favorite === 'true' : undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await contactsService.getContactById(id, userId);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await contactsService.removeContact(id, userId);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await contactsService.addContact(req.body, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await contactsService.updateContact(id, req.body, userId);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await contactsService.updateStatusContact(id, req.body.favorite, userId);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
