const path = require("path").resolve(".")
const pathLink = path


const http = require('http')
const multer = require('multer')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const config = require(pathLink + '/config')
const logger = require(pathLink + '/server/public/methods/log4js').getLogger('App')

const httpPort =  config.appPort


app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
app.use(express.static(require('path').join(__dirname, 'public')))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const objMulter = multer({dest: config.file.upload})
app.use(objMulter.any())

const httpServer = http.createServer(app).listen(httpPort)