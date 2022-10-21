function generateSocketAuth() {
    return new Promise(function(resolve, reject) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText == "-1") reject();
                resolve(this.responseText);
            }
        };
        xmlhttp.open("GET", "../scripts/generateSocketAuth");
        xmlhttp.send();
    })
}
var token;
var socket;
generateSocketAuth().then(result => {
    token = result;
    // console.log(token);
    
    // Create a new WebSocket.
    socket = window.location.hostname == "localhost" ? new WebSocket(`ws://${window.location.hostname}:8888?token=${token}`) : new WebSocket(`wss://${window.location.hostname}/wss2/:8888?token=${token}`);

    function transmitMessage() {
        socket.send( message.value );
    }

    socket.onmessage = function(e) {
        console.debug(e.data);
        var output = e.data;

        // message will come in the format:
        // [type] senderusername: message
        var matches = output.match(/^\[(.+)\] (.+): (.+)$/);
        console.log(matches);
        var type = matches[1];
        var sender = matches[2];
        var message = matches[3];
        
        if(type == "message") {
            // message is a private message
            // do something like adding the chat message to chat div
        }
        else if(type == "world") {
            // message is a world message
            
        }
    }
});