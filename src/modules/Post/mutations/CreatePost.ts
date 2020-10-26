/* eslint-disable no-underscore-dangle */
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { Context } from 'koa';

import PostModel from '../PostModel';
import { PostConnection } from '../PostType';
import { loadAllPosts } from '../PostLoader';

interface ICreatePostPayload {
  title: string;
  text: string;
  id: string;
}

export const mutation = mutationWithClientMutationId({
  name: 'PostCreation',
  description: 'Create new post',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    postEdge: {
      type: PostConnection.edgeType,
      resolve: async (
        post: ICreatePostPayload,
        args: { [argName: string]: any },
        ctx: Context,
      ) => {
        const posts = await loadAllPosts(ctx, { first: 1 });

        return {
          cursor: posts.edges[0].cursor,
          node: post,
        };
      },
    },
  },
  mutateAndGetPayload: async ({ title, text }: ICreatePostPayload) => {
    try {
      const newPost = new PostModel({ title, text });

      return newPost.save();
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);

      return err;
    }
  },
} as FixMe);

export default mutation;
