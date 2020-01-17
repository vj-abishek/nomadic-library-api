const Router = require('@koa/router');

const firestore = require('../lib/firebase').firestore();
const editorModel = require('../models/editor');

const router = new Router();

router.get('/editor', async (ctx) => {
  const formatedResults = [];

  const results = await firestore.collection('editor').get();
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

router.put('/editor/add', async (ctx) => {
  const validatedUser = editorModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  const result = await firestore.collection('editor').add(validatedUser.value);
  ctx.body = result.id;
});

router.post('/editor/update/:id', async (ctx) => {
  const { id } = ctx.params;

  const validatedUser = editorModel.validate(ctx.request.body);
  if (validatedUser.error) {
    ctx.body = validatedUser.error.name;
    ctx.status = 400;
    return;
  }

  try {
    await firestore.collection('editor').doc(id).update(validatedUser.value);
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

router.delete('/editor/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    await firestore.collection('editor').doc(id).delete();
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
