import Joi from 'joi'

export const addKeyword = Joi.object({
  locationCode: Joi.string().required().messages({
    'string.empty': `Please select any one Loacation`,
  }),

  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
  }),
  domain: Joi.string().trim().min(5).domain().required().messages({
    'string.empty': `Domain cannot be an empty field`,
    'string.min': `Domain should have a minimum length of 5`,
    'string.domain': `Please enter valid domain name`,
  }),
})
