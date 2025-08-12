const db = require('../database/database');
const bcrypt = require('bcrypt');

class UserService {
  static async initDB() {
    await db.init()
  }

  static async getUserList() {
    let users = {}
    let code = 200
    let status = 'success'
    try {
      const data = await db.queryUserList();
      users = data.map(user => ({
        userId: user.id,
        username: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        province: user.province,
        postcode: user.postcode,
        role: user.role
      }))
    } catch (error) {
      console.log('getUsersInfo:', error)
      code = 404
      status = 'Data not found'
    }

    let result = {
      data: users,
      code: code,
      status: status
    }
    return result;
  }

  static async getUserInfo(name) {
    let data = null
    try {
      data = await db.queryUserInfo(name)
      // console.log(data)
      const result = {
        username: data.name,
        email: data.email,
        address: data.address,
        city: data.city,
        province: data.province,
        postcode: data.postcode,
        role: data.role
      }
      console.log(result)
      return result
    } catch (error) {
      console.error(error.message)
    }
  }

  static async updateUserInfo(data) {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      return { status: 'Email format is illegal', code: 400023 };
    }
    const postcodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    if (!postcodeRegex.test(data.postcode)) {
      return { status: 'Postcode format is illegal', code: 400024 };
    }
    try {
      await db.updateUserInfo(data);
      return { status: 'success', code: 200 };
    } catch (error) {
      console.error(error.message);
      return { status: 'Data not found', code: 404 };
    }

  }

  // static async checkRole(token) {

  // }

  static async handleLogin(username, password) {
    const result = await db.queryUserInfo(username);
    // not exist
    // console.log(result)
    if (result === null)
      return {
        status: 'User not found',
        code: 404001,
        role: -1
      }
    // console.log(password)
    // console.log(result.password)
    const compareResult = await bcrypt.compare(password, result.password);
    console.log(compareResult)
    // const compareResult = (password === result.password)
    if (compareResult) {
      let role = result.role;
      return {
        status: 'success',
        code: 200,
        role: role
      };
    }
    else
      return {
        status: 'Password error',
        code: 401001,
        role: -1
      };
  }

  static async handleRegister(userInfo) {
    // console.log('register:',userInfo)
    // username can not repeat
    const rows = await db.queryUserInfo(userInfo.username);
    if (rows !== null) {
      return { status: 'Name already exists', code: 400011 };
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userInfo.email)) {
      return { status: 'Email format is illegal', code: 400013 };
    }

    const postcodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    if (!postcodeRegex.test(userInfo.postcode)) {
      return { status: 'Postcode format is illegal', code: 400014 };
    }
    // insert into db
    try {
      const insertResult = await db.insertUserInfo(userInfo);
      console.log('insert result: ', insertResult)
      return { status: 'success', code: 200 };
    } catch (error) {
      console.error('Error in handleRegister:', error.message);
      return { status: 'Data not found', code: 404011 };
    }
  }

}

module.exports = UserService;