const messageModel = require('../model/messageModel')

module.exports.addMessage = async (req,res,next) => {
  try {
    const {from,to,message}  = req.body
    const data = await messageModel.create({
      message:{text:message},
      users: [from,to],
      sender:from,
    })
    if(data) {
      return res.json({msg:"Message added Successfully"})
    } else {
      return res.json({msg:"Failed to add message to the database"})
    }
  }catch (ex) {
    next(ex)
  }
}

module.exports.getAllMessage = async(req,res,next) => {
  try {
    const {from,to} = req.body
    // 从数据库中拿到发送者存到数据库中的数据，回显到页面上
    const maessages = await messageModel.find({
      users: {
        $all: [from,to],
      },
    }).sort({updateAt:1})

    const projectMessages = maessages.map((msg) => {
      return {

        fromSelf:msg.sender.toString() === from,
        message: msg.message.text,

      }
    })
    res.json(projectMessages)
  }catch (ex) {
    next(ex)
  }
}