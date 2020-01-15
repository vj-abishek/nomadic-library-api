const joi = require('@hapi/joi');

module.exports = joi.object({
  name: joi.string().required(),
  publication: joi.string().isoDate().default(new Date().toISOString()),
  cover: joi.string().uri().default('https://yt3.ggpht.com/a-/AAuE7mDK-PHhdS5KH3ZNkHtunEESDe0KZGzWhphqeg=s900-mo-c-c0xffffffff-rj-k-no'),
  country: joi.string(),
  summary: joi.string(),
  editor: joi.string().required(),
});
