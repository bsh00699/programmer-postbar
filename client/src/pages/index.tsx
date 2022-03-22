import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Head from 'next/head'
import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '../common/types'

dayjs.extend(relativeTime)

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    Axios.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log('Get Posts Err:', err))
  }, [])
  return (
    <div className='pt-12'>
      <Head>
        <title>Welcome to the programmer community</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pr-4">
        {/* posts */}
        <div className="w-160">
          {
            posts.map((post: Post) => {
              const { identifier, body, subName, slug, title,
                createdAt, username, url } = post
              return (
                <div key={identifier} className="flex mt-4 bg-white rounded">
                  {/* 投票 */}
                  <div className="w-10 text-center bg-gray-100 rounded-l">
                    <p>vote</p>
                  </div>
                  {/* 内容 */}
                  <div className="w-full p-2">

                    <div className="flex items-center">
                      <Link href={`/r/${subName}`}>
                        <Fragment>
                          <img src="/images/gravatar.png" className='w-6 h-6 mr-1 rounded-full cursor-pointer' />
                          <span className='text-xs font-bold cursor-pointer hover:underline'>
                            /r/{subName}
                          </span>
                        </Fragment>
                      </Link>
                      <div className="text-xs text-gray-600">
                        <span className='mx-1'>•</span>
                        Posted by
                        <Link href={`u/${username}`}>
                          <span className='mx-1 hover:underline'>/u/{username}</span>
                        </Link>
                        <Link href={url}>
                          <span className='mx-1 hover:underline'>{dayjs(createdAt).fromNow()}</span>
                        </Link>
                      </div>
                    </div>
                    {/* title */}
                    <Link href={url}>
                      <span className='my-4 text-base font-medium'>{title}</span>
                    </Link>
                    {/* body */}
                    {body && <div className='my-1 text-sm'>{body}</div>}
                    {/* footer */}
                    <div className="flex items-center">
                      <Link href={url}>
                        <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                          <i className="mr-1 text-gray-400 fa-solid fa-message"></i>
                          <span className='font-bold'>0 Comments</span>
                        </div>
                      </Link>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 text-gray-400 fa-solid fa-share"></i>
                        <span className='font-bold'>Share</span>
                      </div>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 text-gray-400 fa-solid fa-bookmark"></i>
                        <span className='font-bold'>Save</span>
                      </div>
                    </div>
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
