/* eslint-disable no-underscore-dangle */
import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import PostModel from '../PostModel';

import { PostConnection } from '../PostType';
import { loadAllPosts } from '../PostLoader';

export const mutation = mutationWithClientMutationId({
  name: 'PostCreation',
  description: 'Create new post',
  inputFields: {
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  },
  outputFields: {
    postEdge: {
      type: PostConnection.edgeType,
      resolve: async (post, args, ctx) => {
        const posts = await loadAllPosts(ctx, { first: 1 });

        return {
          cursor: posts.edges[0].cursor,
          node: post,
        };
      },
    },
  },
  mutateAndGetPayload: async ({ title, text }) => {
    try {
      const newPost = new PostModel({ title, text });

      return newPost.save();
    } catch (err) {
      console.log(err);

      return err;
    }
  },
});

export default mutation;
