import { useRouter } from "next/router"
import useSWR from "swr"
import { Post } from "../../common/types"
import PostCard from "../../components/PostCard"

const Sub = () => {
  const router = useRouter()
  const { sub: subName } = router.query
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null)

  if (error) {
    // sub 不存在重定向到home
    router.push('/')
  }

  let postsMark
  if (!sub) {
    postsMark = <div className="text-lg text-center">Loading</div>
  } else if (sub.posts?.length === 0) {
    postsMark = <div className="text-lg text-center">No Posts Submitted</div>
  } else {
    postsMark = sub.posts.map((post: Post) => {
      const { identifier } = post
      return <PostCard key={identifier} post={post} />
    })
  }

  return (
    <div className="container flex pt-5">
      {
        sub && (
          <div className='w-160'>
            {postsMark}
          </div>
        )
      }
    </div>
  )
}

export default Sub
