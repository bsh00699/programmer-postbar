import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import trim from './middleware/trim'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use('/api/auth', authRoutes)

app.get('/', (_, res) => {
  res.send('hello postbar')
})

app.listen(3333, async () => {
  console.log('🚀 Server running at http://localhost:3333');
  try {
    await createConnection()
    console.log('Database connected!!!');
  } catch (err) {
    console.log('statr err: ', err)
  }
})
