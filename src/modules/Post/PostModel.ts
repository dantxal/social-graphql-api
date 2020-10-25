import { Document, Schema, model } from 'mongoose';
import { IComment } from '../Comment/CommentModel';

export interface IPost extends Document {
  title: string;
  text: string;
  comments: IComment[];
}
const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model<IPost>('Post', schema);
