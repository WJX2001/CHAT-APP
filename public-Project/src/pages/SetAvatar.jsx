import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import loader from '../assets/loader.gif'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes'
import { Buffer } from 'buffer'

// 设置头像函数
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`
  const navigate = useNavigate()
  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  // 初始化判断，若本地localStorage 没有存储，则返回到登录页面
  useEffect(() => {
    const initState = async () => {
      if(!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      }
    }
    initState()
  },[])

  // 设置个人资料图片
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem("chat-app-user")
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      console.log(data)
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        // 存入loacalStorage
        localStorage.setItem(
          "chat-app-user",
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = []
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        )
        const buffer = new Buffer(image.data)
        data.push(buffer.toString('base64'))
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 增加延迟，防止请求接口报429的错误
      }
      setAvatars(data)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                  key={index}>
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              )
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3em;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`
