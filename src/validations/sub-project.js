import Joi from 'joi'

export const SubProject = Joi.object({
  locationCode: Joi.string().required().messages({
    'string.empty': `Please select any one loacation`,
  }),
  keywordCheckFrequency: Joi.number().required().messages({
    'number.base': `Please select any one checking frequency`,
  }),
  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
    'any.required': `Keyword cannot be an empty field`,
  }),
  enableEmail: Joi.allow(),
  tags: Joi.allow(),
})

export const editSubProject = Joi.object({
  locationCode: Joi.allow(),
  keywordCheckFrequency: Joi.allow(),
  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
    'any.required': `Keyword cannot be an empty field`,
  }),
  tags: Joi.allow(),
  // tags: Joi.array().min(1).messages({
  //   'array.empty': `Tag cannot be an empty field`,
  //   'any.required': `Tag is a required field`,
  //   'array.min': `Tag should have a minimum length of 1`,
  // }),
})

export const AddKeywordModalJoi = Joi.object({
  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
    'any.required': `Keyword cannot be an empty field`,
  }),
  tags: Joi.allow(),
})
