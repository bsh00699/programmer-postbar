import { Request, Response, Router } from "express";
import { getConnection } from 'typeorm'
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from '../entities/Sub'
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middleware/auth";

const VOTE_TYPE = [-1, 0, 1]

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body
  if (!VOTE_TYPE.includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0 or 1' })
  }
  try {
    const user: User = res.locals.user
    let post: Post = await Post.findOneOrFail({ identifier, slug })
    let vote: Vote | undefined
    let comment: Comment | undefined
    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier })
      vote = await Vote.findOne({ user, comment })
    } else {
      vote = await Vote.findOne({ user, post })
    }

    if (!vote && value === 0) {
      // 没有投票 并且 票数是 0
      return res.status(404).json({ error: 'Vote not found' })
    } else if (!vote) {
      //没有投过票，但是票数 是 1 或者 -1，需要创建投票
      vote = new Vote({ user, value })
      if (comment) {
        // 对评论进行投票
        vote.comment = comment
      } else {
        // 对帖子进行投票
        vote.post = post
      }
      await vote.save()
    } else if (value === 0) { // vote && value === 0
      await vote.remove()
    } else if (vote.value !== value) {
      // 更新db中已经存在的投票
      vote.value = value
      await vote.save()
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] }
    )

    post.setUserVote(user)
    post.comments.forEach((c) => c.setUserVote(user))

    return res.json(post)

  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const topSubs = async (_: Request, res: Response) => {
  try {
    /**
     * SELECT s.title, s.name,
     * COALESCE('http://localhost:5000/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') as imageUrl,
     * count(p.id) as "postCount"
     * FROM subs s
     * LEFT JOIN posts p ON s.name = p."subName"
     * GROUP BY s.title, s.name, imageUrl
     * ORDER BY "postCount" DESC
     * LIMIT 5;
     */
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(5)
      .execute()

    return res.json(subs)
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()
router.post('/vote', auth, vote)
router.get('/top-subs', topSubs)

export default router