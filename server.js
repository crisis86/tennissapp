const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
// const router = jsonServer.router(path.join(__dirname, 'data/db.json'))
const router = jsonServer.router(__dirname, 'data/db.json') //change per deploy render DIsk
const middlewares = jsonServer.defaults()
const PORT = process.env.PORT || 10000; //  chose port from here like 8080, 3001

server.use(cors())
server.use(jsonServer.bodyParser)
server.use(middlewares)
server.use(router)


server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})

/* const jsonServer = require('json-server')
const clone = require('clone')
const data = require('./db.json')

const isProductionEnv = process.env.NODE_ENV === 'production';
const server = jsonServer.create()
const PORT = process.env.PORT || 10000; //  chose port from here like 8080, 3001

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
})
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})

server.use(router)
server.listen(PORT, () => {
    console.log('JSON Server is running ' + PORT)
})

// Export the Server API
module.exports = server */