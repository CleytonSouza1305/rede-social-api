const HttpError = require("../error/HttpError")

module.exports = (error, req, res, next) => {
  if (error) {
    if (HttpError instanceof Error) {
      res.status(error.status).json({ message: error.message })
    }
    res.status(400).json({ message: error.message })
  } else {
    next()
  }
}