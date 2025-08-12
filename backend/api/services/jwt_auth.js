const jwt = require('jsonwebtoken')
// random Base64 key
const JWT_SECRET = 'Tpv/yCLn0kdoE4VRTa8VmtGQGbdGQ/tFRtjlUDE7VmRhUv6cWsTIbkoXLZaYBu/y'

const signToken = (username, role) => {
  const payload = {
    username: username,
    role: role,
  }

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '12h'
    }
  )
  return token
}

// Not REST compliant, deprecated
// const blackToken = async (token) => {
//   try {
//     const decoded = jwt.decode(token);
//     if (!decoded || !decoded.exp) {
//       return res.status(400).json({ message: 'Invalid token' });
//     }
//     const timeToExpire = decoded.exp - Math.floor(Date.now() / 1000);

//     await this.redisSet(token, 'blacklisted', 'EX', timeToExpire);
//     return true;
//   } catch (error) {
//     console.error('Logout error:', error);
//   }
// }

const checkToken = (req, res, next) => {
  // console.log(req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  console.log(token)
  if (!token) {
    return res.status(403).json({ message: 'Invalid request, please log in' })
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid request, please log in' })
    }
    req.user = user
    next()
  })
}

const checkRole = () => {
  return (req, res, next) => {
    let payload = null;
    try {
      // get payload
      const token = req.headers['authorization'];
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      payload = JSON.parse(jsonPayload);
    } catch (error) {
      console.error('token error :', error);
      return res.status(401).json({ message: 'Invalid request, please log in' });
    }
    console.log('payload: ', payload);
    
    if (payload === null) {
      return res.status(401).json({ message: 'Invalid request, please log in' });
    } else {
      if (payload.role !== 1) {
        return res.status(403).json({
          message: 'You have no authorization to visit this page'
        });
      }
    }
    next();
  };
};

module.exports = {
  signToken,
  checkToken,
  checkRole
}