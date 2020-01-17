jest.mock('firebase-admin');

const admin = require('firebase-admin');

const mockCert = {
  credential: {
    cert: jest.fn(),
  },
};

test('initialize app should have been called', () => {
  // eslint-disable-next-line global-require
  const firebase = require('../firebase');
  expect(firebase).toEqual(admin);
  expect(admin.initializeApp).toHaveBeenCalledTimes(1);
  expect(admin.initializeApp).toHaveBeenCalledWith({
    credential: mockCert.credential.cert(),
    databaseURL: 'https://nomadic-library-265215.firebaseio.com',
  });
});
