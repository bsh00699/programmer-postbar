import Axios from 'axios';
import Link from 'next/link'
import { Fragment } from 'react'
import { useAuthDispatch, useAuthState } from '../ctx/auth'

const Navebar: React.FC = () => {
  const { authenticated, loading } = useAuthState()
  const dispatch = useAuthDispatch()

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
    <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
      <i className="pl-3 pr-3 text-gray-500 fas fa-search"></i>
      <input
        type="text"
        className='py-1 pr-3 bg-transparent rounded h-9 w-80 focus:outline-none'
        placeholder='Search'
      />
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