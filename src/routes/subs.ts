import { Request, Response, Router } from "express";
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'
import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from '../middleware/auth'
import user from '../middleware/user'


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

const router = Router()
router.post('/', user, auth, createSub)

export default router