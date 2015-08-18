var app = {
    server: 'http://127.0.0.1:3000/classes/Lobby',
    init: function(){
        app.friends = {}
        app.fetch()
        app.username= 'genericUser'

        //if using a text field, every character input is a change so look into text field vs dropdown
        $(document).on('change', '#roomSelect', function() {
            var currentRoom = $('#roomSelect').val()
            $('#chats').find('.'+currentRoom).show()
            $('#chats > div').not('.'+currentRoom).hide()
        })

        $(document).on('click', '.username', function(){
            var friendName = $(this).text()
            app.friends[friendName] = true;
            app.addFriend(friendName)
        });

        $(document).on('submit', '#send', app.handleSubmit)

        // $(document).on('submit', '#send', function(e){
        //     app.handleSubmit(e)
        // })

        setInterval(app.fetch,10000)

    },

    send: function(message){
        $.ajax({
            type:'POST',
            url:app.server,
            data:JSON.stringify(message),
            success:function(data){
                console.log('Success: ',data)
            },
            error:function(data){
                console.log('error: ',data)
            }
        })
    },

    fetch: function(){
        $.ajax({
            type:'GET',
            url:app.server,
            // data: {orderBy: '-createdAt'},
            success:function(data){
                app.clearMessages()
                data = JSON.parse(data);
                console.log(data);
                data.results.forEach(app.addMessage)

                var currentRoom = $('#roomSelect').val()
                $('#chats').find('div').not('.'+currentRoom).hide()

                for(var name in app.friends){
                    app.addFriend(name)
                }

                console.log('Success: ',data)
            },
            error:function(data){
                console.log('error: ',data)
            }
        })
    },

    clearMessages: function(){
        $('#chats').html('')
    },

    addMessage: function(message){

        function sanitize(item){
            return item ? item.replace(/</g, "&lt;").replace(/>/g, "&gt;") : undefined
        }

        function fixRoomNames(roomName){
            return roomName ? roomName.replace(/ /g,'').replace(/'/g,'') : undefined
        }

        var username = sanitize(message.username)
        var roomname = fixRoomNames(sanitize(message.roomname))
        var text = sanitize(message.text)

        if(!$('#roomSelect').find('option[value="'+roomname+'"]').length && !!roomname){
            app.addRoom(roomname)
        }

        var newMessage = $('<div>').html('<b><span class="username">'+username+'</span>: </b>'+text)
            .addClass(roomname)
        $('#chats').append(newMessage)

    },

    addRoom: function(room){
        var newRoom = $('<option>').val(room).text(room)
        $('#roomSelect').append(newRoom)
    },

    addFriend: function(friend){
        $('.username:contains("'+friend+'")').css('color','red')
    },

    handleSubmit: function(e){
        e.preventDefault();
        var message = {
            username: 'genericUser',
            text:$('#message').val(),
            roomname:$('#roomSelect').val()
        };
        app.send(message);
        console.log('submitted')
    }
}

app.init()
