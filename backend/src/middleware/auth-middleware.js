const HttpError = require("../error/HttpError")
const jwt = require('jsonwebtoken')
const { findUserById } = require("../models/auth-user")

module.exports = {
  authenticate: (req, res, next) => {
    const headerToken = req.headers.authorization
    if (!headerToken) throw new HttpError(401, 'Credenciais inválidas')

      try {
        const token = headerToken.split(" ")[1]
        const encryptedUser = jwt.verify(token, process.env.JWT_KEY)
        
        const user = findUserById(encryptedUser.id)
    
        req.isAutorizated = true
        req.user = user

        next()
        
      } catch (error) {
        throw new HttpError(400, `Token inválido.`)
      }
    
  },

  authenticateRole: (req, res, next) => {
    if (!req.user) throw new HttpError(404, 'Usuário inválido.')

    if (!req.isAutorizated) throw new HttpError(401, 'Usuário ' + actualUser.userName + ' não autorizado.')

    const actualUser = req.user
      
    if (actualUser.role !== 'Admin') throw new HttpError(401, 'Usuário ' + actualUser.userName + ' não permitido.')

    next()
  }
}