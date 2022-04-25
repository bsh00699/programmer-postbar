import "reflect-metadata";
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import trim from './middleware/trim'

import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import subRoutes from './routes/subs'
import miscRoutes from './routes/misc'

dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
}))
app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subs', subRoutes)
app.use('/api/misc', miscRoutes)

app.get('/', (_, res) => {
  res.send('hello postbar')
})

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  try {
    await createConnection()
    console.log('Database connected!!!');
  } catch (err) {
    console.log('statr err: ', err)
  }
})
