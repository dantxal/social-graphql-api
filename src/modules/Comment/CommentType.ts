import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../graphql/NodeDefinitions';
import { IComment } from './CommentModel';

const commentType = new GraphQLObjectType<IComment>({
  name: 'CommentType',
  description: 'Comment Type',
  fields: () => ({
    id: globalIdField('Comment'),
    text: {
      type: GraphQLString,
      resolve: (comment: FixMe) => comment.text,
    },
    createdAt: {
      type: GraphQLNonNull(GraphQLDateTime as FixMe),
    },
    updatedAt: {
      type: GraphQLNonNull(GraphQLDateTime as FixMe),
    },
  }),
  interfaces: [nodeInterface as FixMe],
} as FixMe);

export const CommentConnection = connectionDefinitions({
  name: 'Comment',
  nodeType: commentType as FixMe,
});

export default commentType;
