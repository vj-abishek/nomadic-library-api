// Modules import
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

// Files import
const logger = require('./src/lib/logger');

// Routes import
const users = require('./src/routes/users');
const books = require('./src/routes/books');
const editors = require('./src/routes/editors');
const editions = require('./src/routes/editions');

// App initialization
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('@google-cloud/trace-agent').start();
}
const app = new Koa();

app.listen(8000, () => logger.log({ text: 'API server running on port 8000' }));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // eslint-disable-next-line no-console
  console.log(`-- ${ctx.method} -- "${ctx.url}" -- ${ms}ms`);
});
app.use(bodyParser());

app.use(users.routes());
app.use(books.routes());
app.use(editions.routes());
app.use(editors.routes());
