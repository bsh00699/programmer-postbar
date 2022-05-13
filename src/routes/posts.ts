import { Request, Response, Router } from "express";
import Post from "../entities/Post"
import Sub from "../entities/Sub"
import Comment from "../entities/Comment";
import auth from "../middleware/auth";
import user from '../middleware/user'


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
      relations: ['comments', 'votes', 'sub'],
    })
    // 用户没登录可以获取posts
    // 如果用户登录了, 需要获取用户自己登录的投票,添加到post
    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user))
    }
    // const posts = await Post.find({
    //   order: { createdAt: 'DESC' },
    //   relations: ['comments', 'votes', 'sub'],
    //   skip: currentPage * postsPerPage,
    //   take: postsPerPage,
    // })

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
      relations: ['sub', 'votes', 'comments']
    })
    if (res.locals.user) {
      post.setUserVote(res.locals.user)
    }
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

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const post = await Post.findOneOrFail({ identifier, slug })
    const comments = await Comment.find({
      where: { post },
      order: { createdAt: 'DESC' },
      relations: ['votes']
    })

    if (res.locals.user) {
      comments.forEach(c => c.setUserVote(res.locals.user))
    }

    return res.json(comments)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: `Get post comments err: ${err}` })
  }
}

const router = Router()
router.post('/', user, auth, createPost)
router.get('/', user, getPosts)
router.get('/:identifier/:slug', user, getPost)
router.post('/:identifier/:slug/comments', user, auth, commentOnPost)
router.get('/:identifier/:slug/comments', user, getPostComments)


export default router
