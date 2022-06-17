import Axios from 'axios'
import { FormEvent, useState } from "react"
import Head from 'next/head'
import { GetServerSideProps } from "next"
import classNames from 'classnames'
import { useRouter } from 'next/router'

const Create = () => {

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDesc] = useState('')
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()

  const submitForm = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await Axios.post(`/subs`, {
        name, title, description
      })
      router.push(`/r/${res.data.name}`)
    } catch (err) {
      console.log(err);
      setErrors(err.response.data)
    }
  }

  return (
    <div className='flex bg-white'>
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="h-screen bg-cover w-80"
        style={{ backgroundImage: "url('/images/robot.jpg')" }}
      >
      </div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-98">
          <div className="mb-2 text-lg font-medium">Create a Community</div>
          <hr />
          <form onSubmit={submitForm}>
            <div className="my-6">
              <div className="font-medium">Name</div>
              <div className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed
              </div>
              <input type="text"
                className={classNames('w-full p-3 border border-gray-200 rounded', {
                  'border-red-600': errors.name
                })}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.name}</small>
            </div>
            <div className="my-6">
              <div className="font-medium">Title</div>
              <div className="mb-2 text-xs text-gray-500">
                Community title represent the topic an you change it at any time
              </div>
              <input type="text"
                className={classNames('w-full p-3 border border-gray-200 rounded', {
                  'border-red-600': errors.title
                })}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.title}</small>
            </div>
            <div className="my-6">
              <div className="font-medium">Description</div>
              <div className="mb-2 text-xs text-gray-500">
                This is how new members come to understand your community
              </div>
              <textarea
                className={classNames('w-full p-3 border border-gray-200 rounded', {
                  'border-red-600': errors.description
                })}
                value={description}
                onChange={(e) => setDesc(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.description}</small>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 blue button">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie
    if (!cookie) throw new Error('Missing auth token cookie')
    await Axios.get('/auth/me', {
      headers: { cookie }
    })
    return { props: {} }
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end()
  }
}