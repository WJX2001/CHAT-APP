const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();
const userRoutes = require('./routes/userRoutes')

// 请求环境变量
require("dotenv").config()

// 解决跨域问题
app.use(cors())

// 解析请求体中的JSON数据，并将其转化为 js 对象 
app.use(express.json())

// 使用路由文件
app.use('/api/auth',userRoutes)


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