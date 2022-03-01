import { Request, Response, Router } from "express";
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { User } from "../entities/User";
import auth from '../middleware/auth'

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body
  try {
    let errors: any = {}
    const emailUser = await User.findOne({ email })
    const usernameUser = await User.findOne({ username })
    if (emailUser) errors.email = 'Email is already exist'
    if (usernameUser) errors.username = 'Username is already exist'
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors })
    }

    const user = new User({
      email, username, password
    })

    errors = await validate(user)
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }

    await user.save()
    user.email = email
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    let errors: any = {}
    if (isEmpty(username)) errors.username = 'Username must not be empty'
    if (isEmpty(password)) errors.password = 'Password must not be empty'
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors)
    }
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password is incorrect' })
    }
    // create token
    const token = jwt.sign({ username }, process.env.JWT_SECRET)
    // set cookie
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 * 4,
        path: '/'
      })
    )
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const me = (_: Request, res: Response) => {
  // try {
  //   const token = req.cookies.token
  //   if (!token) throw new Error('Unauthenticated')

  //   const { username }: any = jwt.verify(token, process.env.JWT_SECRET)
  //   const user = await User.findOne({ username })
  //   if (!user) throw new Error('Unauthenticated')

  //   return res.json(user)
  // } catch (err) {
  //   console.log(err)
  //   return res.status(401).json({ error: 'Unauthenticated' })
  // }
  return res.json(res.locals.user)
}

const logout = (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // 立即过期
      path: '/'
    })
  )
  return res.status(200).json({ success: true })
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)
router.get('/logout', auth, logout)

export default router