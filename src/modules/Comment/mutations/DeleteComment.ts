import { GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
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

  mutateAndGetPayload: async ({ commentId }) => {
    try {
      const { _, id } = fromGlobalId(commentId);
      const comment = await loadComment('', id);
      const postFound = await loadPost('', comment.postId);
      postFound.comments = postFound.comments.filter(
        el => el.toString() !== id.toString(),
      );
      await postFound.save();
      await comment.deleteOne();

      return comment;
    } catch (err) {
      console.error(err);

      return err;
    }
  },
});

export default mutation;
