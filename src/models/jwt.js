const joi = require('@hapi/joi');

const date = new Date();
const expiration = date.setMonth(date.getMonth(), 6);

module.exports = joi.object({
  creation: joi.date().iso().default(date.toISOString()),
  expiration: joi.date().iso().default(new Date(expiration).toISOString()),
  jwt: joi.string().required(),
});
