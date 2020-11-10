const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('msg')
const emojiToggle = document.getElementById('emoji-toggle')
const emojiPicker = document.querySelector('emoji-picker')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

//Get username and room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Join chatroom
socket.emit('joinRoom', { 
    username,
    room
})

// Get room users and room info

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

emojiPicker.style.display = 'none'

socket.on('message',message =>{
    outputMessage(message)

    //Scroll messages
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submision

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // get message text
    const msg = e.target.elements.msg.value
    // Emmit the message to the server
    socket.emit('chatMessage',msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})

//Add message text to webpage

function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span> </p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)

}

// Add room name to DOM

function outputRoomName(room){
    roomName.innerText = room
}


// Add users to chat

function outputUsers (users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
//add emoji to selection

document.querySelector('emoji-picker')
  .addEventListener('emoji-click', (event) => {
      event.preventDefault()
      const emjoiText = event.detail.unicode
     messageInput.value += " " + emjoiText
     event.target.style.display = "none"
    });

//Toggle emoji picker

emojiToggle.addEventListener('click', () => {

 
    
    if (emojiPicker.style.display === 'none'){
        emojiPicker.style.display = "block"
       
    }
    else{
        emojiPicker.style.display = 'none'
       
    }
})