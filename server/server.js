//imports the top level function exported by the express module
const express = require("express");
const {ApolloServer} = require('apollo-server-express');

const fs = require('fs');

const initialIssues = [{id:1, issue_title:"movie trash", author:"Kgaugelo", status:1, created:"2023-01-03", type:"bug fix"}, 
    {id: 2, issue_title:"Empty vending machine", author:"Kgaugelo", status: 3, created: "2002-12-09", type:"feature refactor"}];


let aboutMessage = "Issue Tracker Version 2";

function setAboutMessage(_, {message}){
    return aboutMessage = message;
}

function issueList(){
    return initialIssues;
}

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList
    },
    Mutation: {
        setAboutMessage
    }};

const server = new ApolloServer({typeDefs:fs.readFileSync("./server/schema.graphql", "utf-8"), resolvers});



// create (instantiate) the server application listening for HTTP requests and sending HTTP responses
const app = express();
app.use(express.static('public'));

// create a middleware function which serves static files to browser, by searching for the required file specified in 
// the http request as a relative path from a root directory specified by the argument in the express.static call

async function StartServer(){
    await server.start();
    server.applyMiddleware({app, path: '/graphql'});
}

StartServer();

//now, mount the middleware on the application, using the applications use method
//app.get('/:main', (req, res) => {
//        res.send("/home/vessel/issue-tracker/public/home.html");
//        console.log(req.params.main);
//    });

//now we can turn on the server application and listen for any HTTP requests
app.listen(3000, function() {console.log("Server listening on port 3000.")});



