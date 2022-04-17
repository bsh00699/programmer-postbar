import { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios';
import { useRouter } from 'next/router'
import { useAuthDispatch, useAuthState } from '../ctx/auth'

export default function Register() {
  const { authenticated } = useAuthState()
  const dispatch = useAuthDispatch()

  const router = useRouter()
  if (authenticated) router.push('/')
  const onFinish = async (values: {
    password: string,
    username: string
  }) => {
    const { password, username } = values
    try {
      const res = await Axios.post('/auth/login', {
        password,
        username,
      })
      console.log('res==', res);

      dispatch('LOGIN', res.data)
      router.push('/')
    } catch (err) {
      message.error(`Login failed: ${JSON.stringify(err.response.data)}`);
    }
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div
        className="flex flex-col justify-center h-screen pl-40 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('/images/work.jpg')`,
        }}
      >
        <div className="px-10 py-10 bg-white w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">Hi my friend, welcome to Programmer Post</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
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
              <Button type="primary" htmlType="submit" className="w-full">Login</Button>
            </Form.Item>
          </Form>
          <small>New to user?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}