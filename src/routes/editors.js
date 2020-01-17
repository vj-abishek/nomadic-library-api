const Router = require('@koa/router');

const firestore = require('../lib/firebase').firestore();
const editorModel = require('../models/editor');

const router = new Router();

router.get('/editors', async (ctx) => {
  const formatedResults = [];

  const results = await firestore.collection('editors').get();
  if (results.empty) {
    ctx.status = 204;
    ctx.message = 'No editors in collection';
    return;
  }

  results.forEach((document) => {
    formatedResults.push({ id: document.id, data: document.data() });
  });
  ctx.body = formatedResults;
});

router.get('/editors/:id', async (ctx) => {
  const user = await firestore.collection('editors').doc(ctx.params.id).get();

  ctx.body = { id: user.id, data: user.data() };
});

router.put('/editors/add', async (ctx) => {
  const validatedUser = editorModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  const result = await firestore.collection('editors').add(validatedUser.value);
  ctx.body = result.id;
});

router.post('/editors/update/:id', async (ctx) => {
  const { id } = ctx.params;

  const validatedUser = editorModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  try {
    await firestore.collection('editors').doc(id).update(validatedUser.value);
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

router.delete('/editors/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    await firestore.collection('editors').doc(id).delete();
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
