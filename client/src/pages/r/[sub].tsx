import { useRouter } from "next/router"
import useSWR from "swr"
import Head from 'next/head'
import { Post, Sub } from "../../common/types"
import PostCard from "../../components/PostCard"
import SideBar from "../../components/SideBar"
import { ChangeEvent, createRef, Fragment, useEffect, useState } from "react"
import Image from 'next/image'
import { useAuthState } from '../../ctx/auth'
import classNames from 'classnames'
import Axios from "axios"

const SubPage = () => {
  const [ownSub, setOwnSub] = useState(false)
  const { authenticated, user } = useAuthState()
  const router = useRouter()
  const fileInputRef = createRef<HTMLInputElement>()
  const { sub: subName } = router.query
  const { data: sub, error, mutate } = useSWR<Sub>(subName ? `/subs/${subName}` : null)

  if (error) {
    // sub 不存在重定向到home
    router.push('/')
  }

  useEffect(() => {
    if (!sub) return
    setOwnSub(authenticated && user.username === sub.username)
  }, [sub])

  const openFileInput = (type: string) => {
    if (!ownSub) return
    fileInputRef.current.name = type
    fileInputRef.current.click()
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileInputRef.current.name)
    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      mutate()
    } catch (err) {
      console.log(err);
    }
  }

  let postsMark
  if (!sub) {
    postsMark = <div className="text-lg text-center">Loading</div>
  } else if (sub.posts?.length === 0) {
    postsMark = <div className="text-lg text-center">No Posts Submitted</div>
  } else {
    postsMark = sub.posts.map((post: Post) => {
      const { identifier } = post
      return <PostCard key={identifier} post={post} revalidate={mutate} />
    })
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {
        sub && (
          <Fragment>
            <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
            {/* subtitle && image */}
            {/* bannerImage */}
            <div className={classNames('bg-blue-500', {
              'cursor-pointer': ownSub
            })} onClick={() => openFileInput('banner')}>
              {
                sub.bannerUrl
                  ? (
                    <div className="h-56 bg-blue-500" style={{
                      backgroundImage: `url(${sub.bannerUrl})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  )
                  : (
                    <div className="h-16 bg-blue-500"></div>
                  )
              }
            </div>
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -12 }}>
                  <Image
                    src={sub.imageUrl}
                    alt='Sub'
                    className={classNames('rounded-full', { 'cursor-pointer': ownSub })}
                    width={70}
                    height={70}
                    onClick={() => openFileInput('image')}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-2xl font-bold">{sub.title}</h1>
                  </div>
                  <div className="text-sm font-bold text-gray-500">/r/{sub.name}</div>
                </div>
              </div>
            </div>
            {/* post && sidebar */}
            <div className="container flex pt-5">
              <div className='w-160'>
                {postsMark}
              </div>
              <SideBar sub={sub} />
            </div>
          </Fragment>
        )
      }
    </div>
  )
}

export default SubPage
