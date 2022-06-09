import Axios from 'axios';
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { Sub } from '../common/types';
import Image from 'next/image'
import { useAuthDispatch, useAuthState } from '../ctx/auth'
import { useRouter } from 'next/router';

const Navebar: React.FC = () => {
  // search bar
  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null)

  const { authenticated, loading } = useAuthState()
  const dispatch = useAuthDispatch()

  const router = useRouter()

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([])
      return
    }
    searchSubs()
  }, [name])

  const Logout = () => {
    Axios.get('/auth/logout')
      .then(() => {
        dispatch('LOGOUT')
        window.location.reload()
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const searchSubs = async () => {
    clearTimeout(timer)
    setTimer(setTimeout(async () => {
      try {
        const { data } = await Axios.get(`/subs/search/${name}`)
        setSubs(data)
      } catch (err) {
        console.log(err);
      }

    }, 200))
  }

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`)
    setName('')
  }

  return <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
    <div className="flex items-center">
      <Link href='/'>
        <img src="/images/crazyCode.png" className='w-8 h-10 mr-2' />
      </Link>
      <span className='hidden text-2xl lg:block'>
        <Link href='/'><span style={{ color: '#1C1C1C' }}><b>Crazy</b> Bar</span></Link>
      </span>
    </div>
    {/* Search */}
    <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
      <i className="pl-3 pr-3 text-gray-500 fas fa-search"></i>
      <input
        type="text"
        className='py-1 pr-3 bg-transparent rounded h-9 w-80 focus:outline-none'
        placeholder='Search'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div className="absolute left-0 right-0 bg-white" style={{ top: '100%' }}>
        {
          subs?.map(sub => (
            <div
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
              onClick={() => goToSub(sub.name)}
            >
              <Image
                src={sub.imageUrl}
                className='rounded-full'
                alt='Sub'
                height={32}
                width={32}
              />
              <div className="ml-4 text-sm">
                <div className="font-medium">{sub.name}</div>
                <div className="text-gray-600">{sub.title}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    {/* Login && logout */}
    <div className="flex">
      {
        !loading && (
          authenticated
            ? (
              <Fragment>
                <a className="py-1 mr-2 leading-5 w-28 hollow blue button"
                  onClick={Logout}
                >Logout</a>
              </Fragment>
            )
            : (
              <Fragment>
                <Link href='/login'>
                  <a className="py-1 mr-2 leading-5 w-28 hollow blue button">Log In</a>
                </Link>
                <Link href='/register'>
                  <a className="py-1 leading-5 w-28 blue button">Sign Up</a>
                </Link>
              </Fragment>
            )
        )
      }
    </div>
  </div>
}

export default Navebar