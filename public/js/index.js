const socket = io();

/**
 * Definimos la variable username y disparamos un modal para que el
 * usuario ingrese su nombre de usuario.
 *  Una vez ingresado, asignamos
 * el valor a la variable username, y emitimos un evento de tipo "new-user"
 */
let username;

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa tu nombre de user',
    icon: 'success',
    inputValidator: (value) =>{
        return !value && 'Es obligatorio introducir nombre de user'
    },
    allowOutsideClick: false,
  }).then((res) =>{
    // console.log(res) //veo el RES  pero quiero el valor del objeto
    username = res.value;
    socket.emit('new-user', username)
  })

  /**
 * Definimos un objeto chatInput que representa el elemento del DOM correspondiente,
 * donde se ingresan los mensajes a enviar. Agregamos un event listener para escuchar eventos
 * de tipo "keyup", para poder identificar cuando el usuario pulsa Enter.
 * Si el usuario pulsa enter y el mensaje no está vacio, el mismo será enviado a través de un evento de tipo
 * 'chat-message'
 */

const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keyup', (ev) =>{
    //si la tecla es enter Y mayor a 0 el msg EMITIMOS elmensaje!! y limpiamos el input! 
    if(ev.key === 'Enter'){
        const inputMsg =chatInput.value;
        
        if (inputMsg.trim().length >0){
            socket.emit('chat-message', {username, message: inputMsg});
            chatInput.value = "";
        }
    }
})


  /**
 * Definimos un objeto msgChat que representa el elemento del DOM correspondiente, donde se displayan
 * los mensajes del chat
 * Asignamos un event listener a nuestro socket que, al escuchar eventos de tipo 'messages', escribirá
 * los mensajes al DOM por medio de este elemento
 */
const msgChat = document.getElementById('messages-panel')

//recibimos la lsita actualizada de msg 
socket.on('messages', (data) =>{
    let messages = "";

    data.forEach((element) => {
        messages += `<b> ${element.username}: </b> ${element.message} </br>`
    });
    msgChat.innerHTML = messages;
})
  /**
 * Disparamos un toast cuando detectamos un evento de tipo 'new-user', que representa que un usuario
 * nuevo se ha unido al chat
 */

  socket.on('new-user', (username) =>{
    Swal.fire({
        title: `${username} se ha unido al chat `,
        toast: true,
        position: "top-end"
    })
  })