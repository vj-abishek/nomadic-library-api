const joi = require('@hapi/joi');

module.exports = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  picture: joi.string().uri().default('https://yt3.ggpht.com/a-/AAuE7mDK-PHhdS5KH3ZNkHtunEESDe0KZGzWhphqeg=s900-mo-c-c0xffffffff-rj-k-no'),
  password: joi.string().min(6).required(),
  jwt: joi.string().required(),
});
