import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import auth from '../middleware/auth'


const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body
  const user = res.locals.user
  if (title.trim() === '') {
    return res.status(400).json({
      title: '标题不能为空'
    })
  }
  try {
    // body should be empty
    const post = new Post({ title, body, user, subName: sub })
    await post.save()
    return res.json(post)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: '创建帖子失败' })
  }
}

const router = Router()
router.post('/', auth, createPost)

export default router
