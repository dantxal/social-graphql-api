import { loadPost } from '../modules/Post/PostLoader';

import Post from '../modules/Post/PostModel';

import Comment from '../modules/Comment/CommentModel';

import { loadComment } from '../modules/Comment/CommentLoader';

const registeredTypes = [
  {
    name: 'Post',
    qlType: 'PostType',
    dbType: Post,
    loader: loadPost,
  },
  {
    name: 'Comment',
    qlType: 'CommentType',
    dbType: Comment,
    loader: loadComment,
  },
];

export default registeredTypes;
