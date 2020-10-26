import { connectionFromMongoCursor } from '@entria/graphql-mongoose-loader';
import { ConnectionArguments } from 'graphql-relay';
import { Context } from 'koa';
import { Types } from 'mongoose';
import Post, { IPost } from './PostModel';
/**
 * Added any because 'object' typing is deprecated but necessary
 * for connectionFromMongoCursor's options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataLoaderKey = string | Types.ObjectId | any;

const DataLoader = require('dataloader');

const postLoader = new DataLoader((keys: readonly string[]) =>
  Post.find({ _id: { $in: keys } }).sort('-createdAt'),
);

const loadPost = async (_: Context, id: DataLoaderKey): Promise<IPost> => {
  return postLoader.load(id);
};

const loadAllPosts = (
  ctx: Context,
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
    context: {} as Context,
    args,
    loader: loadPost,
  });
};

export { loadPost, postLoader, loadAllPosts };
