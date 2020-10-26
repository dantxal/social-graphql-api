/* eslint-disable no-underscore-dangle */
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';

import postType from '../PostType';
import { loadPost } from '../PostLoader';
import { IPost } from '../PostModel';

interface IDeletePostInputPayload {
  title: string;
  text: string;
  postId: string;
}
type IDeletePostPayload = IPost;

export const mutation = mutationWithClientMutationId({
  name: 'PostUpdate',
  description: 'Update post',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
    postId: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { title, text, postId }: IDeletePostInputPayload,
    ctx: Context,
  ) => {
    try {
      const { id } = fromGlobalId(postId);
      const post = await loadPost(ctx, id);
      post.title = title;
      post.text = text;

      return post.save();
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);

      return err;
    }
  },
  outputFields: {
    post: {
      type: GraphQLNonNull(postType),
      resolve: async (
        post: IDeletePostPayload,
        _: { [argName: string]: any },
        ctx: Context,
      ) => loadPost(ctx, post.id),
    },
  },
});

export default mutation;
