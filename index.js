const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = new Server(httpServer, {
  cors: {
 
    origin: ["https://monumental-praline-15f609.netlify.app/",  "http://localhost:3000"],
    credentials: true
  }
});

app.use(cors());

const PORT = process.env.PORT || 7777;

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
