import { connectionFromMongoCursor } from '@entria/graphql-mongoose-loader';
import { ConnectionArguments } from 'graphql-relay';
import { Context } from 'koa';
import { Types } from 'mongoose';
import Comment, { IComment } from './CommentModel';
/**
 * Added any because 'object' typing is deprecated but necessary
 * for connectionFromMongoCursor's options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataLoaderKey = string | Types.ObjectId | any;

const DataLoader = require('dataloader');

const commentLoader = new DataLoader((keys: readonly string[]) =>
  Comment.find({ _id: { $in: keys } }).sort('-createdAt'),
);

const loadComment = async (_: Context, id: DataLoaderKey): Promise<IComment> =>
  commentLoader.load(id);

const loadAllComments = (
  ctx: Context,
  args: ConnectionArguments,
): Promise<{
  edges: { cursor: string; node: Promise<IComment> }[];
  count: number;
  endCursorOffset: number;
  startCursorOffset: number;
  pageInfo: unknown;
}> => {
  const cursor = Comment.find().sort('-createdAt');

  return connectionFromMongoCursor({
    cursor,
    context: {} as Context,
    args,
    loader: loadComment,
  });
};

export { loadComment, commentLoader, loadAllComments };
