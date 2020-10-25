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
      resolve: comment => comment.text,
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

export const { connectionType: CommentConnection } = connectionDefinitions({
  nodeType: commentType,
});

export default commentType;
