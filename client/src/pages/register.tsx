import { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios';
import { useRouter } from 'next/router'
// import { useAuthState } from '../context/auth'

export default function Register() {
  // const { authenticated } = useAuthState()

  const router = useRouter()
  // if (authenticated) router.push('/')
  const onFinish = async (values: {
    email: string,
    password: string,
    username: string
  }) => {
    const { email, password, username } = values
    try {
      await Axios.post('/auth/register', {
        email,
        password,
        username,
      })
      router.push('/login')
    } catch (err) {
      message.error(`Sign up failed: ${JSON.stringify(err.response.data)}`);
    }
  };

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
          <p className="mb-10 text-xs">Hi my friend you've come to the right place</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<MailOutlined />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>
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
              <Button type="primary" htmlType="submit" className="w-full">Sing Up</Button>
            </Form.Item>
          </Form>
          <small>Already a account?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}