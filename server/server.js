
const initialIssues = [{id:1, issue_title:"movie trash", author:"Kgaugelo", status:1, created:new Date("2023-01-03"), type:"bug fix", due: new Date("2023-07-03")}, 
{id: 2, issue_title:"Empty vending machine", author:"Kgaugelo", status: 3, created: new Date("2002-12-09"), type:"feature refactor", due: new Date("2002-06-09")}];


//imports the top level function exported by the express module
const express = require("express");
const {ApolloServer} = require('apollo-server-express');
const {Kind} = require('graphql/language');

//resolver for the GraphQLScalarType
const {GraphQLScalarType, parseValue} = require('graphql');

//import file sync
const fs = require('fs');


//message to be fetched by About API
let aboutMessage = "Issue Tracker Version 2";

//create Query and Mutation resolvers


function issueList(){
    return initialIssues;
}

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList
    },
    Mutation: {
        setAboutMessage: (_, {message}) => {
            aboutMessage = message;
            return aboutMessage;
        },
        newIssue: (_, {input}) => {
            input.id = initialIssues.length + 1;
            input.created = new Date();

            //if status undefined, set to 0
            if(input.status == null) input.status = 0;

            initialIssues.push(input);
            return initialIssues;
        }
    },
    GraphQLDate: new GraphQLScalarType({
        name: "GraphQLDate", 
        description:"A Date type",
        // converts outgoing date to string
        serialize(value){
            return value.toISOString();
        },

        //the following converts incoming date strings to Dates
        parseValue(value){
            return new Date(value);
        },
        parseLiteral(ast){
            return (ast.kind == Kind.STRING) ? new Date(ast.value) : "undefined";
        }})
    };

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



