const db = require('../database/database')
const fs = require('fs').promises
const path = require('path')

class ItemService {
  static async getItemList(filtPara) {
    const data = await db.queryItemList(filtPara)
    // console.log(data)
    const items = await Promise.all(data.map(async item => {
      let imgData = null
      try {
        if (item.img_path) {
          const imgPath = path.join(__dirname, '..', '..', 'icon', 'icon_' + item.img_path);
          console.log(imgPath)
          imgData = await fs.readFile(imgPath)
          imgData = imgData.toString('base64')
        }
      } catch (error) {
        console.error('Reading failed:', item.id, error)
      }
      return {
        itemId: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        brand: item.brand,
        rate: item.rate,
        ctg: item.ctg,
        img: imgData
      }
    }))
    return items
  }

  static async getItemDetails(itemId) {
    const item = await db.queryItem(itemId)
    console.log(item)
    let imgData = null
    try {
      if (item.img_path) {
        const imgPath = path.join(__dirname, '..', '..', 'img', item.img_path);
        // console.log(imgPath)
        imgData = await fs.readFile(imgPath)
        imgData = imgData.toString('base64')
      }
    } catch (error) {
      console.error('Reading failed:', item.id, error)
    }
    let data = {
      itemId: item.id,
      name: item.name,
      spec: JSON.parse(item.specification),
      price: item.price,
      stock: item.stock,
      brand: item.brand,
      rate: item.rate,
      ctg: item.ctg,
      img: imgData
    }
    return data
  }

  // delete from cart, bud not delete from item info (just set stock=0)
  static async deleteItem(id) {
    let data = {
      itemId: id,
      qty: 0
    }
    try {
      let status = await this.updateItemStock(data)
      await db.deleteItemFromCart(id)
      return status
    } catch (error) {
      console.log(error)
      return {
        code: 401081,
        message: 'Database error'
      }
    }
    // origin design: true delete operation
    // let status = await db.queryItem(id)
    // if (status.length < 1) {
    //   return {
    //     code: 404081,
    //     message: 'Item does not exist'
    //   }
    // }
    // try {
    //   await db.deleteItem(id)
    //   return {
    //     code: 200,
    //     message: 'success'
    //   }
    // } catch (error) {
    //   console.log(error)
    //   return {
    //     code: 401081,
    //     message: 'Database error'
    //   }
    // }
  }

  static async updateItemStock(data) {
    let id = data.itemId
    let qty = data.qty
    // console.log('update stock',id,qty)
    let status = await db.queryItem(id)
    if (db.isEmpty(status)) {
      return {
        code: 404071,
        message: 'Item does not exist'
      }
    }
    try {
      await db.updateStock(id, qty, 'mod')
      return {
        code: 200,
        message: 'success'
      }
    } catch (error) {
      console.log(error)
      return {
        code: 401071,
        message: 'Database error'
      }
    }
  }

}

module.exports = ItemService;