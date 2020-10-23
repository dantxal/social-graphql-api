import 'dotenv/config';
import koaPlayground from 'graphql-playground-middleware-koa';
import { GraphQLError } from 'graphql';

import schema from './schema';

const Koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const Bodyparser = require('koa-bodyparser');
const mongoose = require('mongoose');

const { MONGO_URL } = process.env;

if (!MONGO_URL) throw new Error('Please set MONGO_URL environment variable');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

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

app.listen(process.env.PORT || 8000, () => {
  console.log('server is running on http://localhost:8000/graphiql');
});
