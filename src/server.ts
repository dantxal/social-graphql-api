import koaPlayground from 'graphql-playground-middleware-koa';

import { GraphQLError } from 'graphql';
import schema from './schema'; //eslint-disable-line

import Koa = require('koa');

import Bodyparser = require('koa-bodyparser');

import Router = require('@koa/router');

const mongoose = require('mongoose');

const graphqlHTTP = require('koa-graphql');
const cors = require('@koa/cors');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
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

const graphqlSettingsPerReq = async (req: Request) => {
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
