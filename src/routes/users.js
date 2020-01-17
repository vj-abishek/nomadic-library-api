const Router = require('@koa/router');

const firestore = require('../lib/firebase').firestore();
const userModel = require('../models/user');

const router = new Router();

router.get('/users', async (ctx) => {
  const formatedResults = [];

  const results = await firestore.collection('users').get();
  if (results.empty) {
    ctx.status = 204;
    ctx.message = 'No users in collection';
    return;
  }

  results.forEach((document) => {
    formatedResults.push({ id: document.id, data: document.data() });
  });
  ctx.body = formatedResults;
});

router.get('/users/:id', async (ctx) => {
  const user = await firestore.collection('users').doc(ctx.params.id).get();

  ctx.body = { id: user.id, data: user.data() };
});

router.put('/users/add', async (ctx) => {
  const validatedUser = userModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  const result = await firestore.collection('users').add(validatedUser.value);
  ctx.body = result.id;
});

router.post('/users/update/:id', async (ctx) => {
  const { id } = ctx.params;

  const validatedUser = userModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  try {
    await firestore.collection('users').doc(id).update(validatedUser.value);
    ctx.status = 200;
  } catch (error) {
    if (error.code === 5) {
      ctx.body = 'bad identifier';
      ctx.status = 400;
      return;
    }
    ctx.status = 500;
  }
});

router.delete('/users/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    await firestore.collection('users').doc(id).delete();
    ctx.status = 200;
  } catch (error) {
    if (error.code === 5) {
      ctx.body = 'bad identifier';
      ctx.status = 400;
      return;
    }
    ctx.status = 500;
  }
});

module.exports = router;
