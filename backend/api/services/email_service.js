const db = require('../database/database')
const nodemailer = require('nodemailer')
let transporter = null

class EmailService {

  static async init() {
    transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: 'buwenxiao@qq.com', // sender
        pass: 'hxjycyulphqodfdf' // mtp
      }
    })
  }


  static async send(username) {
    if(transporter === null)
      this.init()
    const id = await db.queryUserId(username)
    const target = await db.queryEmail(id)
    const orderData = await db.queryLastOrderInfo(id)
    let items = JSON.parse(orderData.items)
    console.log(items)
    if (orderData === null) {
      return {
        data: null,
        message: 'Order not found',
        code: 404031
      }
    }
    console.log('email target:', target)
    const pattern = /^.*(?=\sGMT)/;
    const time = (orderData.time.toString()).match(pattern)[0];
    let content = `
    <style>
       table { width: 100%; border-collapse: collapse; }
       th, td { padding: 8px; }
       tr { border-bottom: 1px solid; }
   </style>
    <h1>${username}, thank you for your purchase!</h1>
      <h3>Order:  ${orderData.id}</h3>
      <h3>Payment Account:  ${orderData.card}</h3>
      <h3>Time:  ${time}</h3>
      <h3>Details: </h3>
      <table>
       <tr>
           <th>Item</th>
           <th>Price</th>
           <th>Qty</th>
           <th>Tax</th>
           <th>Total</th>
       </tr>
       ${items.map(item => `
           <tr>
               <td>${item.name}</td>
               <td>$${Number(item.price).toFixed(2)}</td>
               <td>${item.qty}</td>
               <td>$${Number(item.tax).toFixed(2)}</td>
               <td>$${Number(item.total).toFixed(2)}</td>
           </tr>
       `).join('')}
       <tr style="border-top: 2px solid; border-bottom: 0px; font-weight: bold;">
           <td colspan="3">Summary</td>
           <td>$${items.reduce((sum, item) => sum + item.tax, 0).toFixed(2)}</td>
           <td>$${items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
       </tr>
   </table>
    `
    // console.log('email content:', content)
    let mailobj = {
      from: '"Online Store Office" <buwenxiao@qq.com>', // sender address
      to: target, // receiver
      subject: 'Simulate Checkout Confirmation',
      html: content
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailobj, (err, data) => {
        if (err) {
          console.log(err);
          reject({
            message: 'Email address not found',
            code: 404032,
            data: null
          });
        } else {
          resolve({
            code: 200,
            message: 'success',
            data: null
          });
        }
      });
    });
  }

}

module.exports = EmailService;