import { FormEvent, useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Head from 'next/head'
import Link from 'next/link'
// import Axios from 'axios'
// import { useRouter } from 'next/router'

// import InputGroup from '../components/InputGroup'
// import { useAuthState } from '../context/auth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agreement, setAgreement] = useState(false)
  const [errors, setErrors] = useState<any>({})

  // const { authenticated } = useAuthState()

  // const router = useRouter()
  // if (authenticated) router.push('/')

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    if (!agreement) {
      setErrors({ ...errors, agreement: 'You must agree to T&Cs' })
      return
    }
    // try {
    //   await Axios.post('/auth/register', {
    //     email,
    //     password,
    //     username,
    //   })

    //   router.push('/login')
    // } catch (err) {
    //   setErrors(err.response.data)
    // }
  }

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <div
        className="flex flex-col justify-center h-screen pl-40 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('/images/work.jpg')`,
        }}
      >
        <div className="px-10 py-10 bg-white w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={() => { }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Log in
                </Button>
              {/* Or <a href="">register now!</a> */}
            </Form.Item>
          </Form>
        </div>
        {/* <small>Already a readitor?
            <Link href="/login">
                <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small> */}
      </div>
    </div>
  )
}