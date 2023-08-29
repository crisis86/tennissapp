const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const PORT = process.env.PORT || 10000; //  chose port from here like 8080, 3001

server.use(cors())
server.use(jsonServer.bodyParser)
server.use(middlewares)
server.use(router)


server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})