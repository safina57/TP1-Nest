import * as Joi from 'joi';

export const configSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  SALT_ROUNDS: Joi.string().default(14),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(3600),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});