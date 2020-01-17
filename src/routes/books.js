const Router = require('@koa/router');

const firestore = require('../lib/firebase').firestore();
const bookModel = require('../models/book');

const router = new Router();

router.get('/books', async (ctx) => {
  const formatedResults = [];

  const results = await firestore.collection('books').get();
  if (results.empty) {
    ctx.status = 204;
    ctx.message = 'No books in collection';
    return;
  }

  results.forEach((document) => {
    formatedResults.push({ id: document.id, data: document.data() });
  });
  ctx.body = formatedResults;
});

router.get('/books/:id', async (ctx) => {
  const user = await firestore.collection('books').doc(ctx.params.id).get();

  ctx.body = { id: user.id, data: user.data() };
});

router.put('/books/add', async (ctx) => {
  const validatedBook = bookModel.validate(ctx.request.body);
  if (validatedBook.error) {
    ctx.body = validatedBook.error.name;
    ctx.status = 400;
    return;
  }

  const result = await firestore.collection('books').add(validatedBook.value);
  ctx.body = result.id;
});

router.post('/books/update/:id', async (ctx) => {
  const { id } = ctx.params;

  const validatedBook = bookModel.validate(ctx.request.body);
  if (validatedBook.error) {
    ctx.body = validatedBook.error.name;
    ctx.status = 400;
    return;
  }

  try {
    await firestore.collection('books').doc(id).update(validatedBook.value);
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

router.delete('/books/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    await firestore.collection('books').doc(id).delete();
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
