import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateStatusContact(id, req.body.favorite);
    if (!result) throw HttpError(404);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
