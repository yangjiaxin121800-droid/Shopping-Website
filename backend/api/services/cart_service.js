const db = require('../database/database')
const fs = require('fs').promises
const path = require('path')

class CartService {
  static async updateCartList(data) {
    const [user, ...cart] = data;
    try {
      let result = await db.updateCartList(user.username, cart)
      return {
        data: result,
        code: 401041,
        message: 'Out of stock'
      }
    } catch (error) {
      return {
        data: null,
        code: 404033,
        message: error
      }
    }
  }

  static async getCartList(username) {
    // console.log('getcartlist',username)
    if(db.isEmpty(username)) {
      return null
    }
    let id = await db.queryUserId(username)
    const cart = await db.queryCartList(id)
    if (cart === null)
      return cart
    console.log('getcart:', cart)
    let items = JSON.parse(cart.items)
    console.log(items)
    const result = await Promise.all(items.map(async item => {
      let id = item.id
      let qty = item.qty
      let itemInfo = await db.queryItem(id)
      let imgData = null
      try {
        if (itemInfo.img_path) {
          const imgPath = path.join(__dirname, '..', '..', 'icon', 'icon_' + itemInfo.img_path);
          console.log(imgPath)
          imgData = await fs.readFile(imgPath)
          imgData = imgData.toString('base64')
        }
      } catch (error) {
        console.error(error)
      }
      return {
        itemId: itemInfo.id,
        name: itemInfo.name,
        price: itemInfo.price,
        qty: qty,
        brand: itemInfo.brand,
        rate: itemInfo.rate,
        ctg: itemInfo.ctg,
        img: imgData
      }
    }))
    return result
  }

  static async valCartList(data) {
    let val = await this.updateCartList(data)
    // out of stock
    if (val.data !== null) {
      return {
        code: 400041,
        message: 'Out of stock!',
        data: val.data
      }
    }
    // get info from database
    const [user, ...cart] = data
    const result = await Promise.all(cart.map(async item => {
      let itemInfo = await db.queryItem(item.id)
      // console.log(itemInfo)
      let qty = item.qty
      let subtotal = Number((itemInfo.price)*qty.toFixed(2))
      let tax = Number((subtotal * 0.13).toFixed(2))
      let total = Number((subtotal + tax).toFixed(2))
      let imgData = null
      // console.log(itemInfo.img_path)
      try {
        if (itemInfo.img_path) {
          const imgPath = path.join(__dirname, '..', '..', 'icon', 'icon_' + itemInfo.img_path);
          console.log(imgPath)
          imgData = await fs.readFile(imgPath)
          imgData = imgData.toString('base64')
        }
        return {
          itemId: itemInfo.id,
          name: itemInfo.name,
          qty: qty,
          tax: tax,
          total: total,
          img: imgData
        }
      } catch (error) {
        console.error(error)
      }
    }))
    // console.log('val res',result)
    return {
      code: 200,
      data: result,
      message: 'success'
    }
  }

}

module.exports = CartService;