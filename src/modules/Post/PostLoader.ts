import { connectionFromMongoCursor } from '@entria/graphql-mongoose-loader';
import { ConnectionArguments } from 'graphql-relay';
import Post, { IPost } from './PostModel';

type FixMe = any;

const DataLoader = require('dataloader');

const postLoader = new DataLoader((keys: readonly string[]) =>
  Post.find({ _id: { $in: keys } }).sort('-createdAt'),
);

const loadPost = async (_: FixMe, id: FixMe): Promise<IPost> => {
  return postLoader.load(id);
};

const loadAllPosts = (
  ctx: any,
  args: ConnectionArguments,
): Promise<{
  edges: { cursor: string; node: Promise<IPost> }[];
  count: number;
  endCursorOffset: number;
  startCursorOffset: number;
  pageInfo: unknown;
}> => {
  const cursor = Post.find().sort('-createdAt');

  return connectionFromMongoCursor({
    cursor,
    context: {},
    args,
    loader: loadPost,
  });
};

export { loadPost, postLoader, loadAllPosts };
