import { AppProps } from 'next/app'
import Axios from 'axios';
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import Navebar from '../components/Navbar'
import '../styles/tailwind.css'
import 'antd/dist/antd.css';
import '../styles/icons.css'

import { AuthProvider } from '../ctx/auth'

Axios.defaults.baseURL = 'http://localhost:3333/api'
Axios.defaults.withCredentials = true // set cookie, withCredentials: true

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoute = pathname === '/register' || pathname === '/login'

  return (
    <SWRConfig
      value={{
        refreshInterval: 10000,
        fetcher
      }}
    >
      <AuthProvider>
        {!authRoute && <Navebar />}
        <div className={!authRoute ? 'pt-12' : ''}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  )
}

export default App
