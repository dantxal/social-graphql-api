import { Document, Schema, model } from 'mongoose';

export interface IComment extends Document {
  text: string;
  postId: string;
}
const schema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model<IComment>('Comment', schema);
