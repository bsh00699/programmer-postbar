import Axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from "next/head"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import useSWR from "swr"
import { Post, Sub } from "../../../common/types"
import SideBar from "../../../components/SideBar"


const Submit = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')


  const router = useRouter()
  const { sub: subName } = router.query
  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null)

  if (error) router.push('/')

  const submitPost = async (e: FormEvent) => {
    e.preventDefault()
    if (title.trim() === '') return
    try {
      const { data: post } = await Axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: sub.name
      })
      // 重定向
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`)
    } catch (err) {
      console.log('submit post err', err);
    }
  }

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to CrazyBar</title>
      </Head>
      <div className="mt-4 w-160">
        <div className="p-4 bg-white rounded">
          <div className="mb-3 text-lg">Submit a post to /r/{subName}</div>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none'
                maxLength={300}
                value={title}
                placeholder='Title'
                onChange={e => setTitle(e.target.value)}
              />
              <div className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600"
                style={{ top: 10, right: 10 }}
              >
                {title.trim().length} / 300
              </div>
            </div>
            <textarea
              className='w-full p-3 border border-gray-300 rounded focus:outline-none'
              value={body}
              placeholder='Text (optional)'
              rows={4}
              onChange={e => setBody(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button type='submit' className="px-3 py-1 blue button"
                disabled={title.trim().length === 0}
              >Submit</button>
            </div>

          </form>
        </div>
      </div>
      { sub && <SideBar sub={sub} />}
    </div>
  )
}

export default Submit

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