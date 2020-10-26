import { connectDatabase } from '../src/database';
import Post from '../src/modules/Post/PostModel';
import Comment, { IComment } from '../src/modules/Comment/CommentModel';

const N = 10;
const ignoreConditions = false;

(async () => {
  await connectDatabase();

  const total = await Post.countDocuments();
  const arr = Array.from(Array(N).keys());
  const numOfPosts = (await Post.find({})).length

  /**
   * Seeding explanation
   */
  console.log(
    `\nThis seed script creates ${N} posts if there are less than ${N} post(s) on \nthe database.
Then adds ${N} comment(s) to the last post, if it has less than ${N} comment(s).\n
If you want to disable these conditions, set "ignoreConditions" to true in \n'./scripts/seed.ts'.\n`)

  console.log(`We found ${numOfPosts} post(s).`)

   /**
 * Seeding #1: Posts
 */
  if(ignoreConditions || numOfPosts < N) {
    console.log(`Creating ${N} more post(s).\n`);
    for (const i of arr) {
      const n = total + i + 1;

      await new Post({
        title: `title$${n}`,
        text: `text$${n}`,
      }).save()
    }
    // eslint-disable-next-line
  } else {
    console.log(`No more posts will be created.\n`)
  }

  /**
   * Seeding #2: Comments on last post
   */
  const newCollection = await Post.find({})
  const lastPost = newCollection[newCollection.length - 1];
  const comments: IComment[] = [];

  if(ignoreConditions || lastPost.comments.length < N) {
    console.log(`Creating ${N} comment(s) on post ${lastPost.title}.\n`);
    for (const i of arr) {
      const n = i + 1;

      const newComment = await new Comment({
        text: `comment$${n}`,
        postId: lastPost._id
      }).save()

      comments.push(newComment)
    }
    await lastPost.set('comments', comments).save()
  } else {
    console.log(`Last post has more than ${N - 1} comment(s) already. \nNo more comments will be created.\n`);
  }

  process.exit(0);
})();
