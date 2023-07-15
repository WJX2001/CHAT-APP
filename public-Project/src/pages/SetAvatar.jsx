import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loader from "../assets/loader.gif";
import axios from "axios"
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate()
  return (
    <>
      <Container>
        <div className="title-container">
          111
        </div>
      </Container>
      <ToastContainer />
    </>
  )
}


const Container = styled.div `

`
 