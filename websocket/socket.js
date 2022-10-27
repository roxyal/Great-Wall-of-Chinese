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
// Holds the players to be spawned until phaser has loaded.
// var spawnPlayerHolder = players => document.addEventListener("DOMLoaded", function() {
//     console.log('DOM has loaded');
//     for(let player in players) {
//         let matches = players[player].match(/^(\d+)-(\d+)-(\d+)$/);
//         let characterType = parseInt(matches[1]);
//         let posX = parseInt(matches[2]);
//         let posY = parseInt(matches[3]);
//         spawnPlayerHolder(player, characterType, posX, posY);
//     }
// });
function loadPlayers(players) {
    // console.log("loading players");
    // console.log(players);
    for(let player in players) {
        let matches = players[player].match(/^(\d)-(.+)-(.+)$/);
        let characterType = matches[1];
        let posX = parseInt(matches[2]);
        let posY = parseInt(matches[3]);
        try {
            spawnPlayer(player, characterType, posX, posY);
        }
        catch (e) {
            console.log("respawning...");
            // Wait a bit, then try to respawn player
            window.setTimeout(function() {
                spawnPlayer(player, characterType, posX, posY);
            }, 5000);
        }
    }
}
import { spawnPlayer, movePlayer, destroyPlayer } from "../frontend/src/exports.js";
import { addMessageElement, recipients } from "../frontend/src/exports.js";
// export var socket;
var token;
var world;
var updateLoop;
var moves = {};
// // Set an interval to check the movement queue
// var moveQueue = window.setInterval(function() {
//     // If movement queue has any items
//     for(let [key, value] of Object.entries(moves)) {
//         movePlayer(key, value[0], value[1], value[2]);
//     }
// }, 1000);
generateSocketAuth().then(result => {
    token = result;
    if(window.location.pathname.includes("idioms")) world = "idiom";
    else if(window.location.pathname.includes("hanyu")) world = "pinyin";
    else if (window.location.pathname.includes("blanks")) world = "fill";
    // console.log(token);
    
    // Create a new WebSocket.
    socket = window.location.hostname == "localhost" ? new WebSocket(`ws://${window.location.hostname}:8888?token=${token}&world=${world}`) : new WebSocket(`wss://${window.location.hostname}/wss2/:8888?token=${token}&world=${world}`);

    // Send an update request to the socket every few seconds to account for packet loss
    clearInterval(updateLoop);
    updateLoop = window.setInterval(function() {
        socket.send("/update");
    }, 5000); 

    function transmitMessage() {
        socket.send( message.value );
    }

    socket.onmessage = function(e) {
        console.log(e.data);

        // Spawn the players that are already logged in
        try {
            let players = JSON.parse(e.data);

            // Do the initial load to fetch already logged in players
            if(players.hasOwnProperty("firstload") && players["firstload"] == 0) {
                console.log("initial loading...");
                window.setTimeout(function() {
                    loadPlayers(players);
                }, 3000); 
                delete players["firstload"];
            }
            // console.log(players);

            try {
                let playersToUpdate = {};

                // Check if the players' latest positions are the same as their last recorded position in moves
                for(let [key, value] of Object.entries(players)) {

                    // Save the player's current location if their name did not exist in moves
                    if(!moves.hasOwnProperty(key)) {
                        moves[key] = [value.split("-")];
                        continue;
                    }

                    // Check if the player's last move location is equal to their current location
                    let player = moves[key];
                    let concat = `${player[player.length-1][0]}-${player[player.length-1][1]}-${player[player.length-1][2]}`;
                    console.log(key, value, concat);

                    // Save the player's last updated location
                    moves[key].push(concat.split("-"));

                    if(value == concat) {
                        // console.log("skipping "+key);
                        continue;
                    }
                    playersToUpdate[key] = players[key];
                }

                if(Object.entries(playersToUpdate).length > 0) 
                    loadPlayers(playersToUpdate);
            } catch (e2) {
                // console.log(e2);
            }
        } catch (e) {
            // console.log("spawnPlayer failed");
            // console.log(e);
        }

        // question handler
        if(/^\[question\] (.+)/.test(e.data)) {
            // [question text, choice1, choice2, choice3, choice4, level lower|upper]
            if(adventureModeCurrentQn == "1" && document.getElementById('adventureModeNextQuestion').classList.contains("invisible")) {
                let question = e.data.match(/^\[question\] (.+)/)[1].split(",");
                adventureModeQuestion.innerHTML = question[0];
                for(let i=1; i<=4; i++) {
                    document.getElementById('adventureModeOption'+i).innerHTML = question[i];
                }
                return;
            }
            questionQueue = e.data.match(/^\[question\] (.+)/)[1].split(",");
            return;
        }

        if(/^\[answer\] (.+)/.test(e.data)) {
            var answer = e.data.match(/^\[answer\] (.+)/)[1].split(",");
            // [correct 1|0, correct answer, explanation]
            adventureModeQnAttempted += 1
            if(answer[0]) adventureModeQnCorrect += 1
            adventureModeScore.innerHTML = adventureModeQnCorrect + "/" + adventureModeQnAttempted;
            adventureModeExplanation.innerHTML = `
                <div class="alert alert-${answer[0] ? "success" : "danger"}" role="alert">
                <h4 class="alert-heading">${answer[0] ? "Correct!" : "Incorrect!"}</h4>
                <p>The answer is ${answer[1]}</p>
                <hr>
                <p class="mb-0">${answer[2]}</p>
                </div>
            `;
        }

        // message will come in the format:
        // [type] senderusername: message
        if(/^\[(.+)\] (.+): (.+)/.test(e.data)) {
            var matches = e.data.match(/^\[(.+)\] (.+): (.+)/);
            var type = matches[1];
            var sender = matches[2];
            var message = matches[3];
            
            if(type == "error") {
                // error codes (so far) are: 
                // 1: you cannot challenge yourself
                // 2: the recipient was not found
                // 3: the recipient is currently engaged in pvp
                // switch(sender) {
                //     case "1":
                //         console.log("You cannot challenge yourself.");
                //         break;
                //     case "2":
                //         console.log("The player was not found.");
                //         break;
                //     default: 
                //         console.log("An unknown error occurred.");
                //         break;
                // }
            }
            else if(type == "connect") {
                // [connect] username: characterType
                spawnPlayer(sender, message, 200, 400);
            }
            else if(type == "disconnect") {
                destroyPlayer(sender);
                if(moves.hasOwnProperty(sender)) delete moves[sender];
            }
            else if(type == "move") {
                // [move] username: c1 x200 y400 t0
                // Receive a move event meaning at least one player's position has changed. Create a queue of "moves" for each user. 
                let coords = message.match(/^c(\d) x(.+) y(.+) t(.+)$/);
                if(!moves.hasOwnProperty(sender)) {
                    moves[sender] = [];
                }
                else {
                    // To make smoother animations, find the number of Phaser updates() that have passed since last location data
                    let dt = coords[4]-moves[sender][moves[sender].length-1][3];
                    // Only send location data newer than x updates from the previous data
                    if(dt > 5) {
                        // To prevent sending every single movement to Phaser, wait until there are >2 movements in the same player's queue
                        // if(moves[sender].length > 2) {
                            movePlayer(sender, coords[1], coords[2], coords[3], dt);
                            moves[sender] = [[coords[1], coords[2], coords[3], coords[4]]];
                        // }
                    }
                }
                // Add the new location data to moves
                moves[sender].push([coords[1], coords[2], coords[3], coords[4]]);
                console.log(moves);
            }
            else if(/^to (.+)$/.test(type)) {
                // private message sent from the client
                let recipient = type.match(/^to (.+)$/)[1];
                // do something like adding the chat message to chat div
                addMessageElement("To "+recipient, sender, message);
            }
            else if(type == "message") {
                // private message sent to the client
                // do something like adding the chat message to chat div
                addMessageElement("Message", sender, message);
            }
            else if(type == "world") {
                // message is a world message
                addMessageElement("World", sender, message);
            }
            else if(type == "challenge") {
                // someone sent to me the challenge
                // "Player (sender variable) sent you a challenge"
                var challengeModal = new bootstrap.Modal(document.getElementById('invitationMessage-modal'), {
                    keyboard: false
                  })
                  document.getElementById('invitationMessageSender').innerHTML = sender + " sent you an pvp invitation";
                  challengeModal.show();
                  
                  document.getElementById('acceptPvpInvitation').value = sender;
                  document.getElementById('rejectPvpInvitation').value = sender;
            }
            else if(type == "challenge sent") {
                // you have sent to the player 
                var rejectedModal = new bootstrap.Modal(document.getElementById('sentInvitation-modal'), {
                    keyboard: false
                  })
                  document.getElementById('invitationMessageReceiver').innerHTML = "The invitation has been sent!";
                
                  rejectedModal.show();
            }
            else if(type == "challenge accepted") {
                // just head to the pvp page
            }
            else if(type == "challenge rejected") {
                var rejectedModal = new bootstrap.Modal(document.getElementById('rejectInvitation-modal'), {
                    keyboard: false
                  })
                
                  rejectedModal.show();
            }
        }
    }
});