const User = require('../model/userModel')
const bcrypt = require('bcrypt')


// 注册模块管理
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
  // 查找数据库中 姓名的重复性
  const usernameCheck = await User.findOne({ username })
  if (usernameCheck) {
    return res.json({ msg: 'Username already used', status: false })
  }

  // 对数据库中 邮箱的重复性
  const emailCheck = await User.findOne({ email })
  if (emailCheck) {
    return res.json({ msg: 'Email already used', status: false })
  }

  // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password,10)

  // 创建用户
  const user = await User.create({
    email,
    username,
    password: hashedPassword
  })


  // 这里我们并不需要用户的密码
  delete user.password
  return res.json({status:true,user})

  } catch (ex) {
    next(ex)
  }
}


// 登录模块管理
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // 用户名校验
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }

    // 密码校验
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
      
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// 头像设置处理
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage
      },
    )
    return res.json ({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage
    })
  }catch (ex) {
    next(ex)
  }
}

// 获取用户
module.exports.getAllUsers = async (req, res, next) => {
  try {
    // 选择所有用户但不包括我们本身用户
    const users = await User.find({ _id: {$ne: req.params.id }}).select ([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]);
    return res.json(users )  // 将查询结果返回
  } catch(ex) {
    next(ex)
  }
}