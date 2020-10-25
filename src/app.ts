import 'dotenv/config';
import koaPlayground from 'graphql-playground-middleware-koa';
import { GraphQLError } from 'graphql';
import { connectDatabase } from './database';
import schema from './schema';

const Koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const Bodyparser = require('koa-bodyparser');

connectDatabase()

const app = new Koa();
app.use(Bodyparser());
app.use(cors());

const router = new Router();
router.get('/', (ctx, next) => {
  ctx.body = 'hello visitor';

  return next();
});

const graphqlSettingsPerReq = async (req): Promise<graphqlHTTP.OptionsData> => {
  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
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

const graphqlServer = graphqlHTTP(graphqlSettingsPerReq);

router.all('/graphql', graphqlServer);

router.all(
  '/graphiql',
  koaPlayground({
    endpoint: '/graphql',
  }),
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
