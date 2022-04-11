import { AppProps } from 'next/app'
import Axios from 'axios';
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Navebar from '../components/Navbar'
import '../styles/tailwind.css'
import 'antd/dist/antd.css';
import '../styles/icons.css'

Axios.defaults.baseURL = 'http://localhost:3333/api'
Axios.defaults.withCredentials = true // set cookie, withCredentials: true

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoute = pathname === '/register' || pathname === '/login'

  return (
    <Fragment>
      {!authRoute && <Navebar />}
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App
