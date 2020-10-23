/* eslint-disable no-underscore-dangle */
import { GraphQLString } from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
  toGlobalId,
} from 'graphql-relay';
import { CommentConnection } from '../CommentType';

import { loadComment } from '../CommentLoader';
import CommentModel from '../CommentModel';
import { loadPost } from '../../Post/PostLoader';

export const mutation = mutationWithClientMutationId({
  name: 'CommentCreation',
  description: 'Create new comment',
  inputFields: {
    postId: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  },
  outputFields: {
    commentEdge: {
      type: CommentConnection.edgeType,
      resolve: async ({ id }, _, ctx) => {
        const comment = await loadComment(ctx, id);

        if (!comment) {
          return null;
        }

        return {
          cursor: toGlobalId('CommentType', comment._id),
          node: comment,
        };
      },
    },
  },
  mutateAndGetPayload: async ({ postId, text }) => {
    try {
      const { _, id } = fromGlobalId(postId);

      const comment = new CommentModel({ text, postId: id });
      await comment.save();

      const post = await loadPost('', id);
      post.comments.push(comment.id);
      await post.save();

      return comment;
    } catch (err) {
      console.log(err);

      return err;
    }
  },
});

export default mutation;
