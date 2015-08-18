// YOUR CODE HERE:

var app = {
  init: function(){},
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {

        console.log(data)
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },
  fetch: function(room){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log(data)
        // if(room === undefined){
        //   room === 'Lobby'
        // }
        //iterate through all message
        for (var i = 0; i < data.results.length; i++){
          if(data.results[i].roomname === room){
            if (data.results[i].text === undefined || data.results[i].text.indexOf('script') === -1 || data.results[i].username.indexOf('script') === -1){
              //prepend each message with user name to chatbox
              $('#chatbox').prepend('<p class="message ' + data.results[i].roomname + '">' + data.results[i].username + ': ' + data.results[i].text + '</p>')
            }
          }
          //if roomname is not in rooms array
          if(rooms.indexOf(data.results[i].roomname) === -1){
            //put it in rooms
            rooms.push(data.results[i].roomname)
          }
        }
        //remove everything in #rooms so there are no duplicates
        $('#rooms').children().remove()
        for(var j = 0; j < rooms.length; j++){
          if(rooms[j] !== undefined && rooms[j].indexOf('<script>') === -1){
          //append every roomname to #rooms
            $('#rooms').append('<option value= "' + rooms[j] +'">' + rooms[j] + '</option>')
          }
        }
        console.log('chatterbox: Messages received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    })
  },
  clearMessages: function(){
    $('.message').remove();
  },
  addMessage: function(room){
    var message = {
      username: location.search.split('=')[1],
      text: $('#userMessage').val(),
      roomname: room
    };
    $('#chatbox').prepend('<p class="message">' + message.username + ': ' + message.text + '</p>');
    app.send(message)
  },
  addRoom: function(){}
};

var rooms = [];


$('#remove').on('click', app.clearMessages);
$('#submit').on('click', function(){
  var selectedRoom = $('#rooms').val()
  app.addMessage(selectedRoom)
});
$('#fresh').on('click', app.fetch);
$('#rooms').on('change', function(){
  $('#chatbox').children().remove()
  var selectedRoom = $('#rooms').val()
  app.fetch(selectedRoom)
})
