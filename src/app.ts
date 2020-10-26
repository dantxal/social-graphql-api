/* eslint-disable no-console */
import 'dotenv/config';
import koaPlayground from 'graphql-playground-middleware-koa';
import { GraphQLError } from 'graphql';
import { Context, Middleware, Next, Request } from 'koa';
import { OptionsData } from 'koa-graphql';
import { connectDatabase } from './database';
import schema from './schema';

const Koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const Bodyparser = require('koa-bodyparser');

const app = new Koa();

(async () => {
  try {
    await connectDatabase();
  } catch (err) {
    console.error(`\nError connecting to database.\n\nError: ${err}`);
  }

  app.use(Bodyparser());
  app.use(cors());

  const router = new Router();
  router.get('/', (ctx: Context, next: Next) => {
    ctx.body = 'hello visitor';

    return next();
  });

  const graphqlSettingsPerReq = async (req: Request): Promise<OptionsData> => {
    return {
      graphiql: process.env.NODE_ENV !== 'production',
      schema: schema as FixMe,
      context: {
        req,
      },
      formatError: (error: GraphQLError) => {
        console.log(error.message);
        console.log(error.locations);
        console.log(error.stack);

        return {
          message: error.message,
          locations: error.locations,
          stack: error.stack,
        };
      },
    };
  };

  const graphqlServer: Middleware = graphqlHTTP(graphqlSettingsPerReq);

  router.all('/graphql', graphqlServer);

  router.all(
    '/graphiql',
    koaPlayground({
      endpoint: '/graphql',
    }),
  );

  app.use(router.routes()).use(router.allowedMethods());
})();

export default app;
