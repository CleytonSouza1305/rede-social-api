const express = require('express')
const { authenticate, authenticateRole } = require('../middleware/auth-middleware')
const authController = require('../controllers/auth-controller.')
const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/users', authenticate, authenticateRole, authController.allUsers)
authRouter.get('/users/:id', authenticate, authenticateRole, authController.userById)
authRouter.put('/users/:id', authenticate, authController.update)
authRouter.delete('/users/:id', authenticate, authController.delete)

module.exports = authRouter