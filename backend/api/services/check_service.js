process.env.TZ = 'America/New_York';
const db = require('../database/database');
const EmailService = require('./email_service')

class CheckService {
  // calc price, mod stock
  static async handlePurchase(name, cart) {
    let result = null
    try {
      let id = await db.queryUserId(name)
      await db.deleteCartList(id)
      result = await Promise.all(cart.map(async item => {
        let modify = await db.updateStock(item.id, item.qty, 'sub')
        if (modify === null) {
          throw error.message('Modify stock error')
        }
      return await this.calcPrice(item)
    })) }
    catch (error) {
      throw error
    }
    return result
  }

  static async calcPrice(item) {
    let id = item.id
    let qty = item.qty
    let itemInfo = await db.queryItem(id)
    let subtotal = Number((itemInfo.price) * qty.toFixed(2))
    let tax = Number((subtotal * 0.13).toFixed(2))
    let total = Number((subtotal + tax).toFixed(2))
    return {
      itemId: itemInfo.id,
      name: itemInfo.name,
      price: itemInfo.price,
      qty: qty,
      subtotal: subtotal,
      tax: tax,
      total: total
    }
  }

  static async getTime() {
    const date = new Date();
    return date.toLocaleString().slice(0, 19).replace('T', ' ');
  }

  static async createOrderID(ts) {
    const timestamp = ts.replaceAll(':', '').slice(-6);
    const random = Math.random().toString(36).slice(-3).toUpperCase();
    return `#${timestamp}${random}`;
  }

  static checkCard(card) {
    // console.log('check', card)
    let cardNumber = card.toString().replace(/[\s-]/g, '')
    if (/^\d{13,19}$/.test(cardNumber) === true)
      return true
    return false
  }

  static async handleCheckout(data) {
    const [user, ...cart] = data
    let name = user.username
    let card = user.card
    console.log('start checkout:',name)
    let cardStatus = this.checkCard(card)
    // console.log('card validation:',cardStatus)
    if (cardStatus === false) {
      return {
        code: 401051,
        message: 'Invalid card',
        data: null
      }
    }
    let val = await db.updateCartList(name, cart)
    if (val !== null && val.data !== null) {
      return {
        code: 400051,
        message: 'Out of stock!',
        data: val.data
      }
    }
    try {
      let timestamp = await this.getTime()
      let order_id = await this.createOrderID(timestamp)
      console.log('orderId', order_id)
      let pay = await this.handlePurchase(name, cart)
      console.log('pay: ', pay)
      await db.insertOrder(order_id, name, card, pay, timestamp)
      let res = await EmailService.send(name)
      console.log('email res:',res)
      return res
    } catch (error) {
      return {
        code: 400052,
        message: 'Purchase error: ' + error.message,
        data: null
      }
    }
  }
}

module.exports = CheckService