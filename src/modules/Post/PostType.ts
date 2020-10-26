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
  fields: (): FixMe => ({
    id: globalIdField('Post'),
    text: {
      type: GraphQLString,
      resolve: (post: FixMe) => post.text,
    },
    title: {
      type: GraphQLString,
      resolve: (post: FixMe) => {
        return post.title;
      },
    },
    comments: {
      type: CommentConnection.connectionType,
      args: connectionArgs,
      resolve: async (post: FixMe, args: FixMe, ctx: FixMe) => {
        return connectionFromArray(
          post.comments.map(id => loadComment(ctx, id)),
          args,
        );
      },
    },
    createdAt: {
      type: GraphQLNonNull(GraphQLDateTime as FixMe),
    },
    updatedAt: {
      type: GraphQLNonNull(GraphQLDateTime as FixMe),
    },
  }),
  interfaces: [nodeInterface as FixMe],
});

export const PostConnection = connectionDefinitions({
  name: 'Post',
  nodeType: postType as FixMe,
});

export default postType;
