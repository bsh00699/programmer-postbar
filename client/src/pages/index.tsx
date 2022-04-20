import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Head from 'next/head'
import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
// import { GetServerSideProps } from 'next' 
import { Post } from '../common/types'
import PostCard from '../components/PostCard'

import useSWR from 'swr'

dayjs.extend(relativeTime)

export default function Home() {
  const { data: posts, error } = useSWR('/posts')
  // const [posts, setPosts] = useState<Post[]>([])
  // useEffect(() => {
  //   Axios.get('/posts')
  //     .then(res => setPosts(res.data))
  //     .catch(err => console.log('Get Posts Err:', err))
  // }, [])
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
            posts?.map((post: Post) => {
              return <PostCard post={post} key={post.identifier} />
            })
          }
        </div>
        {/* side bar */}
      </div>
    </div>
  )
}

// SSR
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }
