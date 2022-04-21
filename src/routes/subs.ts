import { Request, Response, Router } from "express";
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'
import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from '../middleware/auth'
import user from '../middleware/user'
import Post from "../entities/Post";


const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body
  const user: User = res.locals.user
  try {
    let errors: any = {}
    if (isEmpty(name)) errors.name = 'Name must not be empty'
    if (isEmpty(title)) errors.title = 'Title must not be empty'

    // 使用 Query Builder 查询
    // 官方文档: https://typeorm.biunav.com/zh/select-query-builder.html#%E4%BB%80%E4%B9%88%E6%98%AFquerybuilder
    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (sub) errors.name = 'Sub already exists'
    if (Object.keys(errors).length > 0) throw errors
  } catch (err) {
    console.log(err);
    res.status(400).json(err)
  }

  try {
    const sub = new Sub({ name, title, description, user })
    await sub.save()
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: 'Create sub failed'
    })
  }
}

const getSub = async (req: Request, res: Response) => {
  const { name } = req.params
  try {
    const sub: any = await Sub.findOneOrFail({ name })
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    })

    sub.posts = posts
    if (res.locals.user) {
      sub.posts.forEach((p: Post) => p.setUserVote(res.locals.user))
    }

    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ sub: 'Sub not found' })
  }
}

const router = Router()
router.get('/:name', user, getSub)
router.post('/', user, auth, createSub)

export default router