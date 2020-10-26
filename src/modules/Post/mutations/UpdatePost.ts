import { GraphQLID, GraphQLString } from 'graphql';

import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import postType from '../PostType';
import { loadPost } from '../PostLoader';

export const mutation = mutationWithClientMutationId({
  name: 'PostUpdate',
  description: 'Update post',
  inputFields: {
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
    postId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ title, text, postId }) => {
    try {
      const { id } = fromGlobalId(postId);
      const post = await loadPost('', id);
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
      type: postType,
      resolve: async (post, _, ctx) => loadPost(ctx, post.id),
    },
  },
});

export default mutation;
