//imports the top level function exported by the express module
const express = require("express");

// create (instantiate) the server application listening for HTTP requests and sending HTTP responses
const app = express();

// create a middleware function which serves static files to browser, by searching for the required file specified in 
// the http request as a relative path from a root directory specified by the argument in the express.static call

const fileServerMiddleware = express.static("public");

//now, mount the middleware on the application, using the applications use method
app.use(fileServerMiddleware);

//now we can turn on the server application and listen for any HTTP requests
app.listen(3000, function() {console.log("Server listening on port 3000.")})

