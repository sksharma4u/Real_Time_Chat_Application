const express = require('express')
const app = express()
const http = require("http").createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const user = {};
app.get("/", (req, res) => {
    res.send("<h1>server start</h1>");
})
http.listen(8000, function() {
    console.log("Server listening on Port", 8000);
    io.on('connection', socket => { // This is an listen event it means server Listen all new updates , activities 
        //  for example joining of new users.

        socket.on('new-user-joined', name => { // This is an instance in whichh it hanles each connection , individually 
            // According to their event
            user[socket.id] = name;
            socket.broadcast.emit('user-joined', name); // It brodacast the message to all users who already joined the  chat 
        })

        socket.on('send', message => {
            socket.broadcast.emit('new-message', { message: message, name: user[socket.id] });
        })

        socket.on('disconnect', message => {
            socket.broadcast.emit('left', user[socket.id]);
            delete user[socket.id];
        })

    });

})