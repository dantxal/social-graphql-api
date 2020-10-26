import { GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';
import { loadPost } from '../../Post/PostLoader';
import { loadComment } from '../CommentLoader';
import commentType from '../CommentType';

export const mutation = mutationWithClientMutationId({
  name: 'CommentDeletion',
  description: 'Delete comment',
  inputFields: {
    commentId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    payload: {
      type: commentType,
      resolve: test => test,
    },
  },

  mutateAndGetPayload: async ({ commentId }, ctx: Context) => {
    try {
      const { id } = fromGlobalId(commentId);
      const comment = await loadComment(ctx, id);
      const postFound = await loadPost(ctx, comment.postId);
      postFound.comments = postFound.comments.filter(
        el => el.toString() !== id.toString(),
      );
      await postFound.save();
      await comment.deleteOne();

      return comment;
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);

      return err;
    }
  },
});

export default mutation;
