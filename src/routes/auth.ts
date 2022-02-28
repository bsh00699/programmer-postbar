import { Request, Response, Router } from "express";
import { validate } from 'class-validator'
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body
  try {
    let errors: any = {}
    const emailUser = await User.findOne({ email })
    const usernameUser = await User.findOne({ username })
    if (emailUser) errors.email = 'Email is already exist'
    if (usernameUser) errors.email = 'UsernameUser is already exist'
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

const router = Router()
router.post('/register', register)

export default router