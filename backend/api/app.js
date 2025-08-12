process.env.TZ = 'America/New_York';
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt');

const UserService = require('./services/user_service')
const ItemService = require('./services/item_service')
const CartService = require('./services/cart_service')
const CheckService = require('./services/check_service')
const OrderService = require('./services/order_service')
const { signToken, checkToken, checkRole } = require('./services/jwt_auth')

const port = 3036
const address = '10.147.19.129' //zeroTier address of backend
startServer()
const app = express()
app.use(express.json())
app.use(cors());
const helmet = require('helmet');
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xContentTypeOptions: true
  })
);

// generate response
const createResponse = (res, data, code = 200, message = "success") => {
  console.log(message)
  const response = {
    code,
    message,
    data: data || null
  }
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Credentials', 'true')
  // console.log(JSON.stringify(response))
  res.json(response)
}

// salt and hash
const hashPwd = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return next();
    }
    const SALT_ROUNDS = 10;
    const hashedPwd = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    req.body.password = hashedPwd;
    next();
  } catch (error) {
    next(error);
  }
};

// app.get('/api/hello', (req, res) => {
//   let data = {
//     content: 'Hello, World!'
//   }
//   createResponse(res, data)
// })

// const dev = async (req, res, next) => {
//   console.log(req.pathname)
//   console.log(req.body)
//   console.log(req.query)
//   next()
// }

// app.use(dev)

app.post('/api/login', async (req, res) => {
  let { status, code, role } = await UserService.handleLogin(req.body.username, req.body.password)
  if (status == 'success') {
    let token = signToken(req.body.username, role)
    const data = {
      token: token,
      role: role
    }
    createResponse(res, data)
  }
  else {
    createResponse(res, null, code, status)
  }
})
app.post('/api/register', hashPwd, async (req, res) => {
  try {
    const result = await UserService.handleRegister(req.body)
    createResponse(res, null, result.code, result.status)
  } catch (error) {
    createResponse(res, null, 404, 'Data not found')
  }
})
// get item list
app.get('/api/item/list', async (req, res) => {
  let data = await ItemService.getItemList(req.query)
  createResponse(res, data)
})
// add JWT authentication
app.use(checkToken)
// app.post('/api/logout', async (req, res) => {}
// get profile
app.get('/api/user/info', async (req, res) => {
  let result = await UserService.getUserInfo(req.query.username)
  createResponse(res, result)
})
// update profile, frontend checked
app.post('/api/user/info', async (req, res) => {
  let { status, code } = await UserService.updateUserInfo(req.body)
  createResponse(res, null, code, status)
})
// get item detail
app.get('/api/item/details', async (req, res) => {
  let result = await ItemService.getItemDetails(req.query.itemId)
  createResponse(res, result)
})
// update cart list
app.put('/api/cart/list', async (req, res) => {
  let result = await CartService.updateCartList(req.body)
  if (result === null)
    createResponse(res, null)
  else
    createResponse(res, result, 400031, 'Out of stock!')
})
// get existed cart list
app.get('/api/cart/list', async (req, res) => {
  console.log(req.header)
  let result = await CartService.getCartList(req.query.username)
  createResponse(res, result)
})
// checkout validation
app.post('/api/cart/validation', async (req, res) => {
  let result = await CartService.valCartList(req.body)
  createResponse(res, result.data, result.code, result.message)
})
// complete checkout and send email
app.post('/api/checkout', async (req, res) => {
  let result = await CheckService.handleCheckout(req.body)
  createResponse(res, result.data, result.code, result.message)
})
// user check purchase history
app.get('/api/order/list', async (req, res) => {
  let result = await OrderService.getOrderList(req.query.username)
  createResponse(res, result)
})
// detailed order
app.get('/api/order/details', async (req, res) => {
  let orderId = '#'+req.query.orderId
  let result = await OrderService.getOrderInfo(orderId)
  createResponse(res, result.data, result.code, result.message)
})
// app.post('/api/role', async (req, res) => {
//   let result = await UserService.checkRole(req.body.token)
//   createResponse(res, result.data, result.code, result.message)
// })
// admin: get user list
app.get('/api/user/list', checkRole(), async (req, res) => {
  let result = await UserService.getUserList()
  createResponse(res, result.data, result.code, result.status)
})
//admin: get complete order list
app.get('/api/order/fullist', checkRole(), async (req, res) => {
  let result = await OrderService.getFullOrderList()
  createResponse(res, result)
})
//admin: manage order(delete)
// app.delete('/api/order/info', checkRole(), async (req, res) => {
app.delete('/api/order/info', checkRole(), async (req, res) => {
  let orderId = '#'+req.query.orderId
  let result = await OrderService.deleteOrder(orderId)
  createResponse(res, null, result.code, result.message)
})
//admin: manage item(delete)
app.delete('/api/item/info', checkRole(), async (req, res) => {
  let result = await ItemService.deleteItem(req.query.itemId)
  createResponse(res, null, result.code, result.message)
})
//admin: manage item(update stock)
app.put('/api/item/stock', checkRole(), async (req, res) => {
  let result = await ItemService.updateItemStock(req.query)
  createResponse(res, null, result.code, result.message)
})
// init
async function startServer() {
  try {
    await UserService.initDB();
    app.listen(port, address, () => {
      console.log(`Backend is listening on ${port}`)
    })
  } catch (error) {
    console.error(error);
  }
}

// vercel
// export default app;
// local
module.exports = app;

