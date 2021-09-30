import Joi from 'joi'

export const UserList = Joi.object({
  firstName: Joi.string().trim().min(3).max(15).required().messages({
    'string.empty': `First name cannot be an empty field`,
    'string.min': `First name must be longer than 5 character`,
    'string.max': `First name can not be longer than 20 character`,
  }),
  lastName: Joi.string().trim().min(3).max(15).required().messages({
    'string.empty': `Last name cannot be an empty field`,
    'string.min': `Last name must be longer than 5 character`,
    'string.max': `Last name can not be longer than 20 character`,
  }),
  email: Joi.string()
    .email({tlds: {allow: false}})
    .required()
    .messages({
      'string.empty': `Email cannot be an empty field`,
      'string.email': `Enter valid Email Id`,
    }),
  projectAccess: Joi.array().min(1).messages({
    'array.empty': `Assign Project cannot be an empty field`,
    'any.required': `Assign Project is a required field`,
    'array.min': `Assign Project should have a minimum length of 1`,
  }),
  permissionLevel: Joi.number().required().messages({
    'number.base': `Please select any one Permission Level`,
  }),
})

export const MyAcc = Joi.object({
  firstName: Joi.string().trim().min(3).max(15).required().messages({
    'string.empty': `First name cannot be an empty field`,
    'string.min': `First name must be longer than 5 character`,
    'string.max': `First name can not be longer than 20 character`,
  }),
  lastName: Joi.string().trim().min(3).max(15).required().messages({
    'string.empty': `Last name cannot be an empty field`,
    'string.min': `Last name must be longer than 5 character`,
    'string.max': `Last name can not be longer than 20 character`,
  }),
})
