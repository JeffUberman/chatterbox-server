/*************************************************************

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

  console.log("Serving request type " + request.method + " for url " + request.url );

  /* TO-DO request.method is being correctly recognized. 
  have separate handling code for method equals post and method equals get
  Where to store the messages?? array or array of objects? Test for just an array for now.
  For chat client will need multiple arrays/objects. 
  Instead of default headers in line 87, do we need any specific headers to get and post (from postman) 
  test from postman 
  status codes need to be different for post and error
  we need this request method: http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
  */

  // The outgoing status. 
  // var statusCode = 200;
  var statusCode = response.statusCode;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // response.setHeader('Content-Type', 'application/json')
  headers['Content-Type'] = 'application/json';

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
  // var data = {
  //   "username": "monisha",
  //   "profession": "software engg"
  // };
  // request.end(data);
  response.end("Serving request type " + request.method + " for url " + request.url);
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
// }
exports.requestHandler = requestHandler;


