import { Request, Response, Router } from "express";
import Post from "../entities/Post"
import auth from '../middleware/auth'
import Sub from "../entities/Sub"
import Comment from "../entities/Comments";


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

const getPosts = async (_: Request, res: Response) => {
  // const currentPage: number = (req.query.page || 0) as number
  // const postsPerPage: number = (req.query.count || 8) as number

  try {
    const posts = await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['sub']
    })
    // const posts = await Post.find({
    //   order: { createdAt: 'DESC' },
    //   relations: ['comments', 'votes', 'sub'],
    //   skip: currentPage * postsPerPage,
    //   take: postsPerPage,
    // })

    // if (res.locals.user) {
    //   posts.forEach((p) => p.setUserVote(res.locals.user))
    // }

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Get posts failed' })
  }
}

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const post = await Post.findOneOrFail({
      identifier, slug
    }, {
      relations: ['sub']
    })
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  const body = req.body.body
  try {
    const post = await Post.findOneOrFail({ identifier, slug })
    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    })
    await comment.save()
    return res.json(comment)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const router = Router()
router.post('/', auth, createPost)
router.get('/', getPosts)
router.get('/:identifier/:slug', getPost)
router.post('/:identifier/:slug/comments', auth, commentOnPost)


export default router
