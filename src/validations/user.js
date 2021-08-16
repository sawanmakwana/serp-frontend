import Joi from 'joi'

export const addUser = Joi.object({
  email: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
  }),
  password: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
  }),
})
