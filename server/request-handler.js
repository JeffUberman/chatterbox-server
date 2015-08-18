/*************************************************************
http://localhost:8080/?ws=localhost:8080&port=5858

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
 // var exports = {};
// module.exports = {

  //
   /* TO-DO request.method is being correctly recognized.
  have separate handling code for method equals post and method equals get
  Where to store the messages?? array or array of objects? Test for just an array for now.
  For chat client will need multiple arrays/objects.
  Instead of default headers in line 87, do we need any specific headers to get and post (from postman)
  test from postman
  status codes need to be different for post and error
  we need this request method: http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
  */

//<Buffer 7b 20 22 6e 61 6d 65 22 3a 20 22 4a 65 66 66 22 0a 7d> logging data

// gets flushed everytime server rebooted (by nodemon) is this also like response's internal buffer?
// roomname is a property
var messageData = {
  results : []
};


var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  //9 character - classes, later is our substring string.substring(9)
  var specificUrl = request.url.substring(9);
  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";
//check url

  // if(request.url !== 'http://127.0.0.1:3000') {
  //     var statusCode = 404;
  //     response.writeHead(statusCode, headers);
  //     response.end("Nope (server shaking it's head)");

  // } else
  // hard code end points to check for valid urls

  if(request.method === 'POST') {

      var statusCode = 201;
      var cleanData;

      request.on('data', function(data) {
        console.log("in request on");
        cleanData = JSON.parse(data);
        //adding room to messages recieved
        if(!cleanData.roomname && specificUrl !== 'messages'){
          cleanData.roomname = specificUrl;
        } else if (!cleanData.roomname && specificUrl === 'messages'){
          cleanData.roomname = 'defaultRoom';
        }
        messageData.results.push(cleanData);
        console.log(messageData + "this is the POSTed message");
      })

      response.writeHead(statusCode, headers);
      response.end('got your message!');

  } else if(request.method === 'GET') {
      var getSpecificData = {
      results : []
      };
      var statusCode = 200;
      //iterate over results and pick up rooms === specificUrl for loop
      //
      for(var i=0; i<messageData.results.length; i++){
        if(messageData.results[i].roomname === specificUrl){
          getSpecificData.results.push(messageData.results[i]);
        }
      }
      if(getSpecificData.results.length === 0) {
        console.log(getSpecificData.results.length);
        statusCode = 404;
      }
      response.writeHead(statusCode, headers);
      console.log(getSpecificData + "this is the searched data");
      response.end(JSON.stringify(getSpecificData));

    }


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end("Hello, World!");
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};



exports.requestHandler = requestHandler;


