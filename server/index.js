const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();
const userRoutes = require('./routes/userRoutes')
const messagesRoute = require('./routes/messagesRoute')
const socket = require("socket.io")
// 请求环境变量
require("dotenv").config()

// 解决跨域问题
app.use(cors())

// 解析请求体中的JSON数据，并将其转化为 js 对象 
app.use(express.json())

// 使用路由文件
app.use('/api/auth',userRoutes)
app.use('/api/messages',messagesRoute)

// 连接数据库
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,      // 驱动程序的新链接引擎
  useUnifiedTopology:true     // 拓扑引擎的选项
}).then(() => {
  console.log("DB Connection Successful")
}).catch((err) => {
  console.log(err.message)
})





// 启动服务器
const server = app.listen(process.env.PORT,() => {
  console.log(`Server Started on Port ${process.env.PORT}`)
})

 
// 通过以下配置，WebSocket 服务器将允许来自 http://localhost:3000 的网页建立连接，并发送凭证
// 这样，位于 http://localhost:3000 域的网页就可以使用Socket.IO库连接到该WebSocket服务器，并实现实时通信功能。
const io = socket(server,{
  cors: {
    origin: "http://localhost:3000",
    Credential:true   // 是否发送凭证到WebSocket 服务器
  }
})

global.onlineUsers = new Map()

io.on("connection",(socket) => {
  global.chatSocket = socket;
   socket.on("add-user",(userId) => {
    onlineUsers.set(userId,socket.id)
   })

   socket.on("send-msg",(data) => {
    
    const sendUserSocket = onlineUsers.get(data?.to)
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive",data.message)
    }
   })
})