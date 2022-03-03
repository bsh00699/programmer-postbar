import { Request, Response, Router } from "express";
import Post from "../entities/Post"
import auth from '../middleware/auth'
import Sub from "../entities/Sub"


const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body
  const user = res.locals.user
  if (title.trim() === '') {
    return res.status(400).json({
      title: 'Title must not be empty'
    })
  }
  try {
    // body should be empty
    // 是否在db中？
    const subRecord = await Sub.findOneOrFail({ name: sub })
    const post = new Post({ title, body, user, sub: subRecord })
    await post.save()
    return res.json(post)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Create posts failed' })
  }
}

const router = Router()
router.post('/', auth, createPost)

export default router
