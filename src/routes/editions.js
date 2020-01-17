const Router = require('@koa/router');

const firestore = require('../lib/firebase').firestore();
const editionModel = require('../models/edition');

const router = new Router();

router.get('/editions', async (ctx) => {
  const formatedResults = [];

  const results = await firestore.collection('editions').get();
  if (results.empty) {
    ctx.status = 204;
    ctx.message = 'No editions in collection';
    return;
  }

  results.forEach((document) => {
    formatedResults.push({ id: document.id, data: document.data() });
  });
  ctx.body = formatedResults;
});

router.get('/editions/:id', async (ctx) => {
  const user = await firestore.collection('editions').doc(ctx.params.id).get();

  ctx.body = { id: user.id, data: user.data() };
});

router.put('/editions/add', async (ctx) => {
  const validatedUser = editionModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  const result = await firestore.collection('editions').add(validatedUser.value);
  ctx.body = result.id;
});

router.post('/editions/update/:id', async (ctx) => {
  const { id } = ctx.params;

  const validatedUser = editionModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  try {
    await firestore.collection('editions').doc(id).update(validatedUser.value);
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

router.delete('/editions/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    await firestore.collection('editions').doc(id).delete();
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
