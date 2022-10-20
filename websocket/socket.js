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
    socket = new WebSocket(`wss://${window.location.hostname}/wss2/:8888?token=${token}`);

    function transmitMessage() {
        socket.send( message.value );
    }

    socket.onmessage = function(e) {
        console.log(e.data);
    }
});