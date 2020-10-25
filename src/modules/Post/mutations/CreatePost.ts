import { GraphQLString } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';
import PostModel from '../PostModel';

import postType from '../PostType';
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
    post: {
      type: postType,
      resolve: async (post, _, ctx) => loadPost(ctx, post.id),
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
