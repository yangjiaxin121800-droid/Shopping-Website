const mysql = require('mysql2/promise')

class Database {
  constructor() {
    this.poolConfig = {
      host: 'junction.proxy.rlwy.net',
      user: 'root',
      password: 'YTkSQJsbNvVJeIzHoDaMdfmXCHvMraxi',
      database: 'railway',
      port: 18462,
      waitForConnections: true
    }

    this.pool = null
  }

  async init() {
    try {
      this.pool = mysql.createPool(this.poolConfig)
      await this.pool.getConnection()
      console.log('database is connected')
    } catch (error) {
      console.error('cnnection failed: ', error)
      throw error
    }
  }

  async queryUserList() {
    try {
      const [rows] = await this.pool.execute('SELECT * FROM user_info WHERE role=0');
      // console.log(JSON.stringify(formattedData));
      return rows
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  queryUserInfo = async (username) => {
    try {
      const sql = 'SELECT * FROM user_info WHERE name = ?'
      const [row] = await this.pool.execute(sql, [username])
      if (row.length < 1)
        return null
      return row[0]
    } catch (error) {
      throw error
    }
  }

  queryUserId = async (username) => {
    const sql = 'SELECT id FROM user_info WHERE name = ?'
    try {
      const [row] = await this.pool.execute(sql, [username])
      // console.log('query ID:',username, row)
      if (this.isEmpty(row) || row.length < 1)
        return null
      console.log(row)
      return row[0].id
    } catch (error) {
      throw error.message(username, 'User does not exist')
    }
  }

  async queryFullOrderList() {
    const sql = 'SELECT * FROM purchase_history ORDER BY time DESC'
    try {
      const [row] = await this.pool.execute(sql)
      return row
    } catch (error) {
      throw error
    }
  }

  async insertUserInfo(userInfo) {
    try {
      const sql = `
            INSERT INTO user_info (name, password, email, address, postcode, role, city, province) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const params = [
        userInfo.username,
        userInfo.password,
        userInfo.email,
        userInfo.address,
        userInfo.postcode,
        0,
        userInfo.city,
        userInfo.province,
      ];
      console.log(sql, params)
      const result = await this.pool.execute(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async updateUserInfo(info) {
    const field = [];
    const value = [];
    Object.keys(info).forEach(key => {
      if (key !== 'username' && info[key] !== undefined && info[key] !== null) {
        field.push(`${key} = ?`);
        value.push(info[key]);
      }
    });
    value.push(info.username);
    const sql = `
        UPDATE user_info 
        SET ${field.join(', ')}
        WHERE name = ?
      `;
    try {
      const [result] = await this.pool.execute(sql, value);
      return result
    } catch (error) {
      throw error
    }
  }

  isEmpty(data) {
    if (data === undefined || data === null ||
      data === '' || data === '""' || data === "''")
      return true;
    return false;
  }

  async queryItemList(filtPara) {
    let Category = filtPara.Category ? filtPara.Category.replace(/"/g, '') : null
    let Brand = filtPara.Brands ? filtPara.Brands.replace(/"/g, '') : null
    let Price_Low = filtPara.Price_Low || '0'
    let Price_High = filtPara.Price_High || '3000'
    // console.log(Category, Brand, Price_Low, Price_High)
    const conditions = [];
    const values = [];
    if (!this.isEmpty(Category)) {
      conditions.push('ctg = ?');
      values.push(Category);
    }
    if (!this.isEmpty(Brand)) {
      conditions.push('brand = ?');
      values.push(Brand);
    }
    conditions.push('price >= ? AND price <= ?');
    values.push(Number(Price_Low), Number(Price_High));

    const whereCondition = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM item_info ${whereCondition}`;
    // console.log(sql, values)
    try {
      const [result] = await this.pool.execute(sql, values);
      // console.log(result)
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async queryItem(id) {
    // console.log('queryItem:', id)
    const sql = 'SELECT * FROM item_info WHERE id = ?';
    try {
      const [result] = await this.pool.execute(sql, [id])
      if (result.length < 1)
        return result
      return result[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  async queryCartList(id) {
    // console.log(id)
    const sql = 'SELECT * FROM cart_list WHERE id = ?';
    try {
      const [result] = await this.pool.execute(sql, [id]);
      // console.log('querycart',result)
      if (result.length < 1)
        return null
      return result[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  deleteCartList = async (id) => {
    console.log('delete cart:',id)
    const sql = 'DELETE FROM cart_list WHERE id = ?';
    try {
      await this.pool.execute(sql, [id]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  queryStock = async (itemId) => {
    const sql = 'SELECT stock FROM item_info WHERE id = ?'
    try {
      let [res] = await this.pool.execute(sql, [itemId])
      // console.log(res[0])
      return res[0].stock
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  queryItemName = async (id) => {
    const sql = 'SELECT name FROM item_info WHERE id = ?'
    try {
      let [res] = await this.pool.execute(sql, [id])
      // console.log(res[0])
      return res[0].name
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  queryStockStatus = async (data) => (
    await Promise.all(data.map(async item => {
      let name = await this.queryItemName(item.id)
      let stock = await this.queryStock(item.id)
      if (parseInt(item.qty) > parseInt(stock)) {
        return { id: item.id, name: name, qty: stock }
      }
    }))
  )

  insertCartlist = async (id, items) => {
    const sql = 'REPLACE INTO cart_list (id, items) VALUES (?, ?)';
    try {
      await this.pool.execute(sql, [id, items]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  updateCartList = async (name, data) => {
    let id = await this.queryUserId(name)
    if(id == null) {
      return null
    }
    let suf = (await this.queryStockStatus(data)).filter(item => !!item)
    console.log(suf)
    if (suf.length > 0) {
      return suf
    }
    let oldCart = await this.queryCartList(id)
    if (! this.isEmpty(oldCart)) {
      try {
        await this.deleteCartList(id)
      } catch (error) {
        throw error
      }
    }
    const items = JSON.stringify(data)
    await this.insertCartlist(id, items)
    return null
  }
  // get the newest order info
  async queryLastOrderInfo(user_id) {
    const sql = 'SELECT * FROM purchase_history WHERE user_id = ? ORDER BY time DESC'
    try {
      let [res] = await this.pool.execute(sql, [user_id])
      // console.log(res[0])
      if (res.length < 1)
        return res
      return res[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  async queryOrderInfo(id) {
    const sql = 'SELECT * FROM purchase_history WHERE id = ?'
    try {
      let [res] = await this.pool.execute(sql, [id])
      // console.log(res[0])
      if (res.length < 1)
        return res
      return res[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async queryOrderList(name) {
    let id = await this.queryUserId(name)
    console.log(id)
    const sql = 'SELECT * FROM purchase_history WHERE user_id = ? ORDER BY time DESC'
    try {
      let [res] = await this.pool.execute(sql, [id])
      // console.log(res)
      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deleteOrder(id) {
    const sql = 'DELETE FROM purchase_history WHERE id = ?'
    try {
      let [res] = await this.pool.execute(sql, [id])
      // console.log(res)
    } catch (error) {
      throw error
    }
  }

  async updateStock(id, qty, op) {
    const sql = 'SELECT stock FROM item_info WHERE id = ?'
    let stock = -1
    try {
      let [res] = await this.pool.execute(sql, [id])
      if (res.length < 1)
        return null
      stock = res[0].stock
      if (op === 'sub') {
        const updateSql = 'UPDATE item_info SET stock = ? WHERE id = ?'
        let newQty = parseInt(parseInt(stock) - parseInt(qty))
        // console.log(id, 'newQty', newQty)
        if (newQty < 0)
          return null
        await this.pool.execute(updateSql, [newQty, id])
      } else if (op === 'mod') {
        const updateSql = 'UPDATE item_info SET stock = ? WHERE id = ?'
        await this.pool.execute(updateSql, [qty, id])
      }
      return 'success'
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async insertOrder(order_id, name, card, items, timestamp) {
    let user_id = await this.queryUserId(name)
    const sql = 'INSERT INTO purchase_history (id, user_id, card, items, time) VALUES (?, ?, ?, ?, ?)'
    try {
      let [res] = await this.pool.execute(sql, [order_id, user_id, card, items, timestamp])
      console.log(res)
      if (res.length < 1)
        return res
      return res[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  isAllNull(arr) {
    return Array.isArray(arr) &&
      arr.length > 0 &&
      arr.every(item => item === null);
  }

  casUpdateCart = async (id, items) => {
    // console.log('cart update')
    await this.deleteCartList(id)
    await this.insertCartlist(id, items)
  }

  deleteItemFromCart = async (id) => {
    console.log('delete from cart')
    const sql = 'SELECT * FROM cart_list'
    try {
      let [res] = await this.pool.execute(sql)
      // console.log(res)
      await Promise.all(res.map(async info => {
        let itemList = JSON.parse(info.items)
        // console.log('oldlist',itemList)
        let newList = await Promise.all(itemList.map(async item => {
          if (item.id === id)
            return null
          return item
        }))
        if (this.isAllNull(newList)) {
          await this.deleteCartList(info.id)
        } else {
          newList = newList.filter(item => item !== null)
          await this.casUpdateCart(info.id, newList)
        }
      }))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  deleteItem = async (id) => {
    const sql = 'DELETE FROM item_info WHERE id = ?'
    try {
      await this.pool.execute(sql, [id])
      await this.deleteItemFromCart(id)
      // console.log('admin delete item:', res1, res2)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async queryEmail(id) {
    const sql = 'SELECT email FROM user_info WHERE id = ?'
    try {
      let [res] = await this.pool.execute(sql, [id])
      if (res.length < 1)
        return res
      console.log('email:', res[0].email)
      return res[0].email
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async close() {
    try {
      await this.pool.end();
      console.log('connection is closed');
    } catch (error) {
      console.error('close failed:', error);
      throw error;
    }
  }
}

const db = new Database();
module.exports = db;