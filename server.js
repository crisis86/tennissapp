/* // JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001


// Make sure to use the default middleware
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
 // Add custom route here if needed
 jsonServer.rewriter({
  "/api/*": "/$1",
 })
);
server.use(router);
// Listen to port
server.listen(8000, () => {
 console.log("JSON Server is running"+ port);
});
// Export the Server API
module.exports = server; */
const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 10000; //  chose port from here like 8080, 3001

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    
    console.log("JSON Server is running "+ port);
   });