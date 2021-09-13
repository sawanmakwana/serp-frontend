import Joi from 'joi'

export const SubProject = Joi.object({
  locationCode: Joi.string().required().messages({
    'string.empty': `Please select any one loacation`,
  }),
  keywordFrequency: Joi.number().required().messages({
    'number.base': `Please select any one checking frequency`,
  }),
  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
  }),
})
