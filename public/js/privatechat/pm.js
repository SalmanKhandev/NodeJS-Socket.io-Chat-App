

$(document).ready(function() {
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    //console.log(paramOne);
    var newParam = paramOne.split('.');

    //desplay reciver name
    var username = newParam[0];
    $('#receiver_name').text('@'+username);
    
    //console.log('1', newParam);
    swap(newParam, 0, 1);
    //console.log('2', newParam);
    var paramTwo = newParam[0]+'.'+newParam[1];

    socket.on('connect', function() {
        var params = {
            room1: paramOne,
            room2: paramTwo
        }

        socket.emit('join PM', params);

        socket.on('message display', function() {
            $('#reload').load(location.href + ' #reload'); //load data from server
        });

        socket.on('new refresh', function(){
            $('#reload').load(location.href + ' #reload');
        });
    });
     //template for desplaying message using Mustache
    socket.on('new message', function(data) {
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });
        $('#messages').append(message);
    });

    $('#message_form').on('submit', function(e) {
        e.preventDefault();

        var msg = $('#msg').val();
        var sender = $('#name-user').val();

        if(msg.trim().length > 0){
            socket.emit('private message', {
                text: msg,
                sender: sender,
                room: paramOne
            }, function() {
                $('#msg').val('');// once user click on the button clear input field
            });
        }
    });

    sentRequest: [{
        username: 'user 2'
    }]

    $('#send-message').on('click', function() {
        var message = $('#msg').val();


        $.ajax({
            url: '/chat/'+paramOne,
            type: 'POST',
            data: { //m as key Name // m as value 1
                message: message
            },

            success: function() {
                $('#msg').val(''); //Empity text message
            }
        })
    });
});

function swap(input, value_1, value_2) {
    var temp = input[value_1]; //storing value inside temperiar
    input[value_1] = input[value_2];
    input[value_2] = temp;
}