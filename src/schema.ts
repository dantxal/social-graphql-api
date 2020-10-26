import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull } from 'graphql';

import { connectionArgs } from 'graphql-relay';
import { nodeField } from './graphql/NodeDefinitions';
import PostMutations from './modules/Post/mutations';

import CommentMutations from './modules/Comment/mutations';
import { loadAllPosts } from './modules/Post/PostLoader';

import { PostConnection } from './modules/Post/PostType';

import { CommentConnection } from './modules/Comment/CommentType';
import { loadAllComments } from './modules/Comment/CommentLoader';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'The root of all queries',
    fields: {
      node: nodeField,
      posts: {
        type: PostConnection.connectionType as FixMe,
        args: {
          ...connectionArgs,
        },
        resolve: async (_: FixMe, args: FixMe, context: FixMe) =>
          loadAllPosts(context, args),
      },
      comments: {
        type: GraphQLNonNull(CommentConnection.connectionType as FixMe),
        args: {
          ...connectionArgs,
        },
        resolve: async (_: FixMe, args: FixMe, context: FixMe) =>
          loadAllComments(context, args),
      },
    },
  } as FixMe),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      ...PostMutations,
      ...CommentMutations,
    } as FixMe,
  }),
});
