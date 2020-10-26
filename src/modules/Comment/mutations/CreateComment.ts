import { GraphQLString } from 'graphql';

import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';

import { CommentConnection } from '../CommentType';
import { loadAllComments } from '../CommentLoader';
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
      resolve: async (comment, args, ctx) => {
        const comments = await loadAllComments(ctx, { first: 1 });

        return {
          cursor: comments.edges[0].cursor,
          node: comment,
        };
      },
    },
  },
  mutateAndGetPayload: async ({ postId, text }, ctx: Context) => {
    try {
      const { id } = fromGlobalId(postId);

      const comment = new CommentModel({ text, postId: id });
      await comment.save();

      const post = await loadPost(ctx, id);
      post.comments.push(comment.id);
      await post.save();

      return comment;
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);

      return err;
    }
  },
});

export default mutation;
