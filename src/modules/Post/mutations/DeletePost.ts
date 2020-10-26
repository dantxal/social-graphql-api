/* eslint-disable no-underscore-dangle */
import { GraphQLString, GraphQLNonNull, GraphQLArgument } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';

import postType from '../PostType';
import { loadPost } from '../PostLoader';
import { loadComment } from '../../Comment/CommentLoader';
import PostModel, { IPost } from '../PostModel';

interface IDeletePostInputPayload {
  postId: string;
}
type IDeletePostPayload = IPost;

export const mutation = mutationWithClientMutationId({
  name: 'PostDeletion',
  description: 'Delete post',
  inputFields: {
    postId: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    payload: {
      type: GraphQLNonNull(postType),
      resolve: (post: IDeletePostPayload) => post,
    },
  },

  mutateAndGetPayload: async (
    { postId }: IDeletePostInputPayload,
    ctx: Context,
  ) => {
    try {
      const { id } = fromGlobalId(postId);
      const post = await loadPost(ctx, id);

      const comments = await Promise.all(
        post.comments.map(comment => loadComment(ctx, comment)),
      );

      await Promise.all([
        comments.map(comment => comment.deleteOne()),
        PostModel.deleteOne(post),
      ]);

      return post;
    } catch (err: unknown) {
      // eslint-disable-next-line
      console.log(err);

      return err;
    }
  },
});

export default mutation;
