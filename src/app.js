import express from 'express';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import router from './routes/views.router.js'
import { Server } from 'socket.io';


const app = express();
const messages = []

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/../public'))

app.use('/', router)

const httpServer = app.listen(8080, () => console.log('escuchando en el puerto 8080....'))

//conforme convencion es io
const io = new Server(httpServer);

io.on('connection', (socket) =>{
    console.log('new clt conected')

    //escuchamos el event tipo chat-ms => igual nombre del clt
    socket.on('chat-message', (data) =>{
        // console.log(data)
        messages.push(data);
        // console.log(messages)

        //emitimos nvo ev de tipo msg con los nvos mensajes al dom
        io.emit('messages', messages)
    })

    socket.on('new-user', (username) =>{
        
        socket.emit('messages', messages)

        //emitimos msg a todos menos el qe se conecto. 
        socket.broadcast.emit('new-user', username)
    })
})