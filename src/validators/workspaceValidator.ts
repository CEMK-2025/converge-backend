import Joi from 'joi';

export const createWorkspaceSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(255).allow(null, ''),
});
