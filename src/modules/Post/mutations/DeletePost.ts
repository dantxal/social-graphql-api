import { GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import postType from '../PostType';
import { loadPost } from '../PostLoader';
import { loadComment } from '../../Comment/CommentLoader';
import PostModel from '../PostModel';

export const mutation = mutationWithClientMutationId({
  name: 'PostDeletion',
  description: 'Delete post',
  inputFields: {
    postId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    payload: {
      type: postType,
      resolve: test => test,
    },
  },

  mutateAndGetPayload: async ({ postId }) => {
    try {
      const { id } = fromGlobalId(postId);
      const post = await loadPost('', id);

      const comments = await Promise.all(
        post.comments.map(comment => loadComment({}, comment)),
      );

      await Promise.all([
        comments.map(comment => comment.deleteOne()),
        PostModel.deleteOne(post),
      ]);

      return post;
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);

      return err;
    }
  },
});

export default mutation;
