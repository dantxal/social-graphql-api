/* eslint-disable no-underscore-dangle */
import { GraphQLString } from 'graphql';

import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import PostModel from '../PostModel';

import { PostConnection } from '../PostType';
import { loadPost } from '../PostLoader';

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
      resolve: async ({ id }, _, ctx) => {
        const post = await loadPost(ctx, id);

        if (!post) {
          return null;
        }

        return {
          cursor: toGlobalId('PostType', post._id),
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
