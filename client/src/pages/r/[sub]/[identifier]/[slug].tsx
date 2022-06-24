import Axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'
import { Post, Comment } from '../../../../common/types'
import SideBar from '../../../../components/SideBar'
import { useAuthState } from '../../../../ctx/auth'
import ActionButton from '../../../../components/ActionButton'
import { FormEvent, useEffect, useState } from 'react'

dayjs.extend(relativeTime)

const PostPage = () => {
  const [newComment, setNewComment] = useState('')

  const { authenticated, user } = useAuthState()
  const router = useRouter()
  const { identifier, sub, slug } = router.query
  const { data: post, error } = useSWR<Post>(
    identifier && slug
      ? `/posts/${identifier}/${slug}`
      : null
  )

  const { data: comments, mutate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  )

  // SEO
  const [description, setDescription] = useState('')

  if (error) {
    router.push('/')
  }

  useEffect(() => {
    if (!post) return
    let desc = post.body || post.title
    desc = desc.substring(0, 150).concat('...')
    setDescription(desc)
  }, [post])

  // const { body, subName, title, createdAt, username,
  //   url, voteScore, commentCount, userVote } = post

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) {
      router.push('/login')
      return
    }
    if ((!comment && value === post.userVote) || (comment && value === comment.userVote)) {
      value = 0
    }
    try {
      Axios.post('/misc/vote', {
        identifier, slug, value,
        commentIdentifier: comment?.identifier
      })
      mutate()
    } catch (err) {
      console.log(err);
    }
  }

  const submitComment = async (e: FormEvent) => {
    e.preventDefault()
    if (newComment.trim() === '') return
    try {
      await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment
      })
      setNewComment('')
      mutate()
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta property='og:site_name' content="Crazy Bar" />
        <meta name="description" content={description} />
        <meta property='og:description' content={description} />
        <meta property='og:title' content={post.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <div className="flex items-center w-full h-20 p-8 bg-blue-500">
          <div className="container flex">
            {/* 头像 */}
            {
              post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post?.sub.imageUrl}
                    height={70}
                    width={70}
                  />
                </div>
              )
            }
            {/* link */}
            <div className="text-xl font-semibold text-white">
              /r/{sub}
            </div>
          </div>

        </div>
      </Link>
      {/* posts && sidebar*/}
      <div className="container flex pt-5">
        {/* post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {
              post && (
                <>
                  <div className="flex">
                    {/* votes */}
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      {/* upvote */}
                      <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => vote(1)}>
                        <i className={classNames('icon-arrow-up', {
                          'text-red-500': post.userVote === 1
                        })}></i>
                      </div>
                      <div className='text-xs font-bold'>{post.voteScore}</div>
                      {/* downvote */}
                      <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={() => vote(-1)}>
                        <i className={classNames('icon-arrow-down', {
                          'text-blue-600': post.userVote === -1
                        })}></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <div className="flex items-center">
                        <div className="text-xs text-gray-600">
                          Posted by
                        <Link href={`u/${post.username}`}>
                            <span className='mx-1 hover:underline'>/u/{post.username}</span>
                          </Link>
                          <Link href={post?.url}>
                            <span className='mx-1 hover:underline'>{dayjs(post.createdAt).fromNow()}</span>
                          </Link>
                        </div>
                      </div>
                      {/* title */}
                      <div className="my-1 text-xl font-medium">{post.title}</div>
                      {/* body */}
                      <div className="my-3 textsm">{post.body}</div>
                      {/* actionbtn */}
                      <div className="flex items-center">
                        <Link href={post.url}>
                          <ActionButton>
                            <i className="mr-1 text-gray-400 fa-solid fa-message"></i>
                            <span className='font-bold'>{post.commentCount} Comments</span>
                          </ActionButton>
                        </Link>
                        <ActionButton>
                          <i className="mr-1 text-gray-400 fa-solid fa-share"></i>
                          <span className='font-bold'>Share</span>
                        </ActionButton>
                        <ActionButton>
                          <i className="mr-1 text-gray-400 fa-solid fa-bookmark"></i>
                          <span className='font-bold'>Save</span>
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                  {/* comment input area */}
                  <div className="pl-10 pr-6 mb-4">
                    {authenticated ? (
                      <div>
                        <div className="mb-1 text-xs">
                          Comments as{' '}
                          <Link href={`/u/${user.username}`}>
                            <a href="" className="font-semibold text-blue-500">{user.username}</a>
                          </Link>
                        </div>
                        <form onSubmit={submitComment}>
                          <textarea className='w-full p-3 border border-gray-300 rounded outline-none focus:outline-none focus:border-gray-600'
                            onChange={e => setNewComment(e.target.value)}
                            value={newComment}
                          ></textarea>
                          <div className="flex justify-end">
                            <button className='px-3 py-1 blue button' disabled={newComment.trim() === ''}>Comment</button>
                          </div>
                        </form>

                      </div>
                    ) : (
                        <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                          <div className="font-semibold text-gray-400">Login or sign up to leave a comment</div>
                          <div>
                            <Link href='/login'>
                              <div className="px-4 py-1 mr-4 hollow blue button">Longin</div>
                            </Link>
                            <Link href='/register'>
                              <div className="px-4 py-1 hollow blue button">Sign up</div>
                            </Link>
                          </div>
                        </div>
                      )}
                  </div>
                  <hr />
                  {/* comment */}
                  {
                    comments?.map((comment) => (
                      <div className="flex" key={comment.identifier}>
                        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                          {/* upvote */}
                          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => vote(1, comment)}>
                            <i className={classNames('icon-arrow-up', {
                              'text-red-500': comment.userVote === 1
                            })}></i>
                          </div>
                          <div className='text-xs font-bold'>{comment.voteScore}</div>
                          {/* downvote */}
                          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={() => vote(-1, comment)}>
                            <i className={classNames('icon-arrow-down', {
                              'text-blue-600': comment.userVote === -1
                            })}></i>
                          </div>
                        </div>
                        <div className="py-2 pr-2">
                          <div className="mb-1 text-xs leading-none">
                            <Link href={`/u/${comment.username}`}>
                              <a className='mr-1 font-bold hover:underline'>{comment.username}</a>
                            </Link>
                            <span className="text-gray-600">
                              {`
                                ${comment.voteScore}
                                 points •
                                ${dayjs(comment.createdAt).fromNow()}
                              `}
                            </span>
                          </div>
                          <p>{comment.body}</p>
                        </div>
                      </div>
                    ))
                  }
                </>
              )
            }
          </div>
        </div>
        {/* sidebar */}
        {post && <SideBar sub={post.sub} />}
      </div>
    </>
  )

}

export default PostPage