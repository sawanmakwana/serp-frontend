import Joi from 'joi'

export const addUser = Joi.object({
  email: Joi.string()
    .email({tlds: {allow: false}})
    .required()
    .messages({
      'string.empty': `Email cannot be an empty field`,
      'string.email': `Enter valid Email Id`,
    }),
  password: Joi.string().trim().min(5).max(20).required().messages({
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password must be longer than 5 character`,
    'string.max': `Password can not be longer than 20 character`,
  }),
})
