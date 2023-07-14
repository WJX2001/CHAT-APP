const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")



const app = express();
require("dotenv").config()

app.use(cors())

// 解析请求体中的JSON数据，并将其转化为 js 对象 
app.use(express.json())


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