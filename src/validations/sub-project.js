import Joi from 'joi'

export const SubProject = Joi.object({
  locationCode: Joi.string().required().messages({
    'string.empty': `Please select any one Loacation`,
  }),
  keywordFrequency: Joi.string().required().messages({
    'string.empty': `Please select any one Loacation`,
  }),
  keyword: Joi.string().trim().required().messages({
    'string.empty': `Keyword cannot be an empty field`,
  }),
})
