import React, { Fragment } from 'react'
import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { Post } from '../common/types'
import classNames from 'classnames'

dayjs.extend(relativeTime)

const ActionButton = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  )
}

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { identifier, body, subName, slug, title, createdAt, username,
    url, voteScore, commentCount, userVote } = post

  const vote = async (value) => {
    try {
      const res = Axios.post('/misc/vote', {
        identifier, slug, value
      })
      console.log('res--', res);

    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div key={identifier} className="flex mt-4 bg-white rounded">
      {/* 投票 */}
      <div className="w-10 py-3 text-center bg-gray-100 rounded-l">
        {/* upvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => vote(1)}>
          <i className={classNames('icon-arrow-up', {
            'text-red-500': userVote === 1
          })}></i>
        </div>
        <div className='text-xs font-bold'>{voteScore}</div>
        {/* downvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={() => vote(-1)}>
          <i className={classNames('icon-arrow-down', {
            'text-blue-600': userVote === -1
          })}></i>
        </div>
      </div>
      {/* 内容 */}
      <div className="w-full p-2">

        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            {/* <Fragment> */}
            <img src="/images/gravatar.png" className='w-6 h-6 mr-1 rounded-full cursor-pointer' />
            {/* <span className='text-xs font-bold cursor-pointer hover:underline'>
                /r/{subName}
              </span> */}
            {/* </Fragment> */}
          </Link>
          <Link href={`/r/${subName}`}>
            <span className='text-xs font-bold cursor-pointer hover:underline'>
              /r/{subName}
            </span>
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
            <ActionButton>
              <i className="mr-1 text-gray-400 fa-solid fa-message"></i>
              <span className='font-bold'>{commentCount} Comments</span>
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
  )
}

export default PostCard