import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';

import { loadPost } from '../../Post/PostLoader';
import { loadComment } from '../CommentLoader';
import { IComment } from '../CommentModel';
import commentType from '../CommentType';

interface IDeleteCommentInputPayload {
  commentId: string;
}
type IDeleteCommentPayload = IComment;

export const mutation = mutationWithClientMutationId({
  name: 'CommentDeletion',
  description: 'Delete comment',
  inputFields: {
    commentId: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    payload: {
      type: GraphQLNonNull(commentType),
      resolve: (comment: IDeleteCommentPayload) => comment,
    },
  },

  mutateAndGetPayload: async (
    { commentId }: IDeleteCommentInputPayload,
    ctx: Context,
  ) => {
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
