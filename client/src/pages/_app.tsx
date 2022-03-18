import '../styles/globals.css'
import 'antd/dist/antd.css';
import { AppProps } from 'next/app'
import Axios from 'axios';

Axios.defaults.baseURL = 'http://localhost:3333/api'
Axios.defaults.withCredentials = true

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
