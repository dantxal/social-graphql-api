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
        type: GraphQLNonNull(PostConnection.connectionType),
        args: {
          ...connectionArgs,
        },
        resolve: async (_, args, context) => loadAllPosts(context, args),
      },
      comments: {
        type: GraphQLNonNull(CommentConnection.connectionType),
        args: {
          ...connectionArgs,
        },
        resolve: async (_, args, context) => loadAllComments(context, args),
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      ...PostMutations,
      ...CommentMutations,
    },
  }),
});
