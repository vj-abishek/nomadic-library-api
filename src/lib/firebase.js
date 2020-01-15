const admin = require('firebase-admin');

const key = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: 'https://nomadic-library-265215.firebaseio.com',
});

module.exports = admin;
