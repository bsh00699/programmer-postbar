import Axios from 'axios';
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Post } from '../common/types'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    Axios.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log('Get Posts Err:', err))
  }, [])
  return (
    <div className='pt-14'>
      <Head>
        <title>Welcome to the programmer community</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pr-4">
        {/* posts */}
        <div className="w-160">
          {
            posts.map((post: Post) => {
              const { identifier, body } = post
              return (
                <div key={identifier} className="flex mb-4 bg-white rounded">
                  {/* 投票 */}
                  <div className="w-10 text-center bg-gray-200 rounded-l">
                    <p>vote</p>
                  </div>
                  {/* 内容 */}
                  <div className="w-full p-2">
                    <p>{body}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
        {/* side bar */}
      </div>
    </div>
  )
}
