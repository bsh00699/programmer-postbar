import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Head from 'next/head'
import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// import { GetServerSideProps } from 'next' 
import { Post, Sub } from '../common/types'
import PostCard from '../components/PostCard'

import useSWR from 'swr'
import useSWRInfinite from "swr/infinite";
import { useAuthState } from '../ctx/auth'
import { Divider } from 'antd'

dayjs.extend(relativeTime)

export default function Home() {

  const { data, error, mutate, size: page, setSize: setPage, isValidating } = useSWRInfinite<Post[]>(
    (index) => `/posts?page=${index}`
  );

  const posts: Post[] = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  // const { data: posts, error } = useSWR<Post[]>('/posts')
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs')

  const { authenticated } = useAuthState()
  // const [posts, setPosts] = useState<Post[]>([])
  // useEffect(() => {
  //   Axios.get('/posts')
  //     .then(res => setPosts(res.data))
  //     .catch(err => console.log('Get Posts Err:', err))
  // }, [])

  const [observedPost, setObversedPost] = useState('')
  useEffect(() => {
    if (!posts || posts.length === 0) return
    const id = posts[posts.length - 1].identifier
    if (id !== observedPost) {
      setObversedPost(id)
      observeElement(document.getElementById(id))
    }
  }, [posts])

  const observeElement = (element: HTMLElement) => {
    if (!element) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === true) { // 到底部
        setPage(page + 1)
        observer.unobserve(element)
      }
    }, {
      threshold: 1 // 0: 顶部 1: 底部
    })
    observer.observe(element)
  }

  return (
    <div>
      <Head>
        <title>Welcome to the programmer community</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pr-4">
        {/* posts */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isLoadingInitialData && (
            <div className="text-lg text-center">Loading...</div>
          )}
          {
            posts?.map((post: Post) => {
              return <PostCard post={post} key={post.identifier} revalidate={mutate} />
            })
          }
          {isValidating && posts.length > 0 && (
            <div className="text-lg text-center">Loading More...</div>
          )}
        </div>
        {/* side bar */}
        <div className="hidden mt-4 ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {
                topSubs?.map((sub: Sub) => {
                  const { name, imageUrl, postCount } = sub
                  return (
                    <div key={name} className='flex items-center px-4 py-2 text-xs border-b'>
                      {/* image */}
                      <Link href={`r/${name}`}>
                        <a>
                          <Image
                            src={imageUrl}
                            alt='Sub'
                            width={32}
                            height={32}
                            className='rounded-full hover:cursor-pointer'
                          />
                        </a>
                      </Link>
                      <Link href={`r/${name}`}>
                        <div className='ml-2 font-bold hover:cursor-pointer'>
                          /r/{name}
                        </div>
                      </Link>
                      <p className='ml-auto font-med'>{postCount}</p>
                    </div>
                  )
                })
              }
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href='/subs/create'>
                  <div className="w-full px-2 py-1 blue button">
                    Create Community
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
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
