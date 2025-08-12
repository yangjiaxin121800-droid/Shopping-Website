const db = require('../database/database')
const fs = require('fs').promises
const path = require('path')

class OrderService {
  static async getFullOrderList() {
    try {
      let result = await db.queryFullOrderList()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async getOrderList(name) {
    let result = await db.queryOrderList(name)
    result = await Promise.all(result.map(async item => {
      let list = JSON.parse(item.items)
      let totalPrice = 0.0
      list.forEach((i) => {
        totalPrice += Number(i.total)
      })
      item.totalPrice = totalPrice
      item.time = item.time.toString()
      return item
    }))
    return result
  }

  static async getOrderInfo(id) {
    let info = await db.queryOrderInfo(id)
    // console.log('orderinfo',info)
    if (db.isEmpty(info)) {
      return {
        data: null, code: 404051, message: 'Order does not exist'
      }
    }
    let items = JSON.parse(info.items)
    const result = await Promise.all(items.map(async item => {
      let id = item.itemId
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
        itemId: id, name: item.name,
        price: item.price, qty: item.qty,
        brand: itemInfo.brand, ctg: itemInfo.ctg,
        subtotal: item.subtotal, tax: item.tax,
        total: item.total, img: imgData
      }
    }))
    return {
      data: result, code: 200, message: 'success'
    }
  }

  static async deleteOrder(id) {
    let status = await db.queryOrderInfo(id)
    if (db.isEmpty(status)) {
      return {
        code: 404061,
        message: 'Order does not exist'
      }
    }
    try {
      await db.deleteOrder(id)
      return {
        code: 200,
        message: 'success'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = OrderService