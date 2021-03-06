import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from '../middleware/auth'
import user from '../middleware/user'
import Post from "../entities/Post";
import { makeId } from "../util/helper";


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

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      let name = makeId(15)
      name = name + path.extname(file.originalname)
      callback(null, name)
    }
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    const { mimetype } = file
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      callback(null, true)
    } else {
      callback(new Error('File not an image'))
    }
  }
})

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  const user: User = res.locals.user
  try {
    const sub = await Sub.findOneOrFail({
      where: { name }
    })
    if (sub.username !== user.username) {
      return res.status(403).json({
        error: 'You dont own this sub'
      })
    }
    res.locals.sub = sub
    return next()
  } catch (err) {
    return res.status(500).json({
      error: 'Something wrong'
    })
  }
}
const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub
  try {
    const type = req.body.type
    if (!req.file?.path) {
      return res.status(400).json({ error: 'Invalid file' })
    }
    if (type !== 'image' && type !== 'banner') {
      // 尽管文件类型无效，但是也会上传到服务器,所以要把上传的删除掉
      fs.unlinkSync(req.file.path)
      return res.status(400).json({
        error: 'Invalid type'
      })
    }
    let oldImageUrn: string = ''
    if (type === 'image') {
      oldImageUrn = sub.imageUrn ?? ''
      sub.imageUrn = req.file.filename
    } else if (type === 'banner') {
      oldImageUrn = sub.bannerUrn ?? ''
      sub.bannerUrn = req.file.filename
    }
    await sub.save()
    if (oldImageUrn !== '') {
      fs.unlinkSync(`public/images/${oldImageUrn}`)
    }
    return res.json(sub)
  } catch (err) {
    return res.status(500).json({ error: `Something went wrong: ${err}` })
  }
}

const searchSubs = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    if (isEmpty(name)) {
      return res.status(400).json({
        error: 'Name must not be empty'
      })
    }
    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `${name.toLowerCase().trim()}%`
      })
      .getMany()
    return res.json(subs)
  } catch (err) {
    return res.status(500).json({ error: `Something went wrong: ${err}` })
  }
}

const router = Router()
router.get('/:name', user, getSub)
router.get('/search/:name', searchSubs)
router.post('/', user, auth, createSub)
router.post('/:name/image', user, auth, ownSub, upload.single('file'), uploadSubImage)

export default router