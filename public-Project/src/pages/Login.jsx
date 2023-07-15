import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

import { loginRoute } from '../utils/APIRoutes'

export default function Login() {
  // 使用编程式导航
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  // 出现错误后 弹框的配置
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  // 初次加载的时候运行，判断本地存储是否已经存储了状态
  useEffect(() => {
    if(localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (validateForm()) {
      console.log('正在验证哦')
      const { password, confirmPassword, username, email } = values
      // 与远程参数做校验
      const { data } = await axios.post(loginRoute, {
        username,
        email,
        password,
      })
      console.log(data.status)
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }

      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        navigate('/')
      }
    }
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  // 句柄验证
  const validateForm = () => {
    const { username, password } = values
    if (username === '') {
      toast.error('Username  is required.', toastOptions)
      return false
    } else if (password === '') {
      toast.error('Password is required.', toastOptions)
      return false
    }
    return true
  }

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log in</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      font-weight: bold;
      border: none;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s;
      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      text-transform: uppercase;

      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`
