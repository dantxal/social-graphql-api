import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay';
import { nodeInterface } from '../../graphql/NodeDefinitions';
import { IPost } from './PostModel';
import { CommentConnection } from '../Comment/CommentType';
import { loadComment } from '../Comment/CommentLoader';

const postType = new GraphQLObjectType<IPost>({
  name: 'PostType',
  description: 'Post Type',
  fields: () => ({
    id: globalIdField('Post'),
    text: {
      type: GraphQLString,
      resolve: post => post.text,
    },
    title: {
      type: GraphQLString,
      resolve: post => {
        return post.title;
      },
    },
    comments: {
      type: CommentConnection,
      args: connectionArgs,
      resolve: async (post, args, ctx) => {
        return connectionFromArray(
          post.comments.map(id => loadComment(ctx, id)),
          args,
        );
      },
    },
    createdAt: {
      type: GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: GraphQLNonNull(GraphQLDateTime),
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: PostConnection } = connectionDefinitions({
  nodeType: postType,
});

export default postType;
