import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).max(20).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().min(5).max(20),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'Missing field favorite',
    'boolean.base': 'Field favorite must be a boolean',
  }),
});
