export function movePlayer(username, characterType, posX, posY, dt, direction) {
    moving(username, characterType, posX, posY, dt, direction);
}

// Spawn new players that log in
export function spawnPlayer(username, characterType, posX, posy) {
    // console.log("spawnPlayer player "+username);
    spawn(username, characterType, posX, posy);
    while(typeof spawn === 'undefined') {
        setTimeout(spawn(username, characterType, posX, posy), 300);
    }
}

export function destroyPlayer(username) {
    destroy(username);
}

import {getLoggedInUsername} from "../utility.js";
var userName = await getLoggedInUsername();
export var recipients = [];

// Add new message to chat box
export function addMessageElement(chatSetting, sender, message) {
    const chatInput = document.getElementById("inputMessage");
    const chatList = document.getElementById("messages");
    const chatTypeSelect = document.getElementById("chat-type");

    // // Add sender to PM recipient list
    // if(userName !== sender && recipients.indexOf(sender) === -1) {
    //     recipients.push(sender);
    //     const newRecipient = document.createElement('option');
    //     newRecipient.innerHTML = `Say to ${sender}`;
    //     newRecipient.value = sender;
    //     chatTypeSelect.append(newRecipient);
    // }

    const chatType = document.createElement('span');
    chatType.textContent = chatSetting === "World" ? "[World] " : `[${chatSetting}] `;
    chatType.style.color = chatSetting === "World" ? "blue" : "purple";

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = `${sender}: `;
    usernameSpan.style.color = "green";
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    const messageLi = document.createElement("li");
    messageLi.append(chatType);
    messageLi.append(usernameSpan);
    messageLi.append(messageSpan);
    
    chatList.append(messageLi);
    chatList.lastChild.scrollIntoView();
}