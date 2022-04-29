import Axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'
import { Post } from '../../../../common/types'
import SideBar from '../../../../components/SideBar'

dayjs.extend(relativeTime)

const PostPage = () => {

  const router = useRouter()
  const { identifier, sub, slug } = router.query
  const { data: post, error } = useSWR<Post>(
    identifier && slug
      ? `/posts/${identifier}/${slug}`
      : null
  )

  if (error) {
    router.push('/')
  }

  const vote = async (value) => {
    try {
      const res = Axios.post('/misc/vote', {
        identifier, slug, value
      })
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <div className="flex items-center w-full h-20 p-8 bg-blue-500">
          <div className="container flex">
            {/* 头像 */}
            {
              post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
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
                <div className="flex">
                  {/* votes */}
                  <div className="w-10 py-3 text-center bg-gray-100 rounded-l">
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

                </div>
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