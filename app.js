const express = require('express');
const socketio = require('socket.io');
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.render("index");
});

const server = app.listen(process.env.PORT || 6600, () => {
  console.log('Server is listening on port 6600');
});

//initialize socket for the server
const io = socketio(server)

io.on("connection", (socket)=> {
  console.log("New user connected");

  socket.username = "Anonymous"


  socket.on("change_username", data => {
    socket.username = data.username
  })
  
 
  //Handle the new message event
  socket.on("new_message", data=> {
    console.log("new message");
    io.sockets.emit("receive_message", {message: data.message, username: socket.username})
  })

  //user is typing

  socket.on('typing', data => {
    socket.broadcast.emit('typing', {username: socket.username })
  })



  // Listen for the "disconnect" event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});