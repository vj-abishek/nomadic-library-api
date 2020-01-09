// Modules import
const Router = require('@koa/router');
const Koa = require('koa');

// Files import
const logger = require('./src/lib/logger');

// App initialization
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('@google-cloud/trace-agent').start();
}
const app = new Koa();
const router = new Router();

app.listen(8000, () => logger.log({ text: 'API server running on port 8000' }));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // eslint-disable-next-line no-console
  console.log(`-- ${ctx.method} -- "${ctx.url}" -- ${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());
