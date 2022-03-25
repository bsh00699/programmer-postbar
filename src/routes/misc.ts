import { Request, Response, Router } from "express";
import Comment from "../entities/Comments";
import Post from "../entities/Post";
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middleware/auth";

const VOTE_TYPE = [-1, 0, 1]

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body
  if (VOTE_TYPE.includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0 or 1' })
  }
  try {
    const user: User = res.locals.user
    const post = await Post.findOneOrFail({ identifier, slug })
    let vote: Vote | undefined
    let comment: Comment | undefined
    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier })
      vote = await Vote.findOne({ user, comment })
    } else {
      vote = await Vote.findOne({ user, post })
    }

    if (!vote && value === 0) {
      return res.status(404).json({ error: 'Vote not found' })
    } else if (!vote) {
      vote = new Vote({ user, value })
      if (comment) {
        vote.comment = comment
      } else {
        vote.post = post
      }
      await vote.save()
    } else if (value === 0) {

    }

  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()
router.post('/vote', auth, vote)