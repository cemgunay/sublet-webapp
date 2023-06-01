// import modules
const express = require("express");
const http = require("http");
const socket = require("./socket");
const cors = require("cors");
const app = express();
const server = http.createServer(app); // Create a http server with express app
const mongoose = require("mongoose");
const createAgenda = require("./jobs/jobs");
//const morgan = require('morgan');
const helmet = require("helmet");
require("dotenv").config();

const authRoute = require("./routes/auth");
const listingRoute = require("./routes/listings");
const userRoute = require("./routes/users");
const requestRoute = require("./routes/requests");
const bookingRoute = require("./routes/bookings");
const uploadRoute = require("./routes/uploads");
const utilityRoute = require("./routes/utility");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

const Request = require("./models/Requests");

// db
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error", err));

// middleware
app.use(express.json());
app.use(helmet());
//app.use(morgan("common"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// routes
app.use("/server/auth", authRoute);
app.use("/server/listings", listingRoute);
app.use("/server/users", userRoute);
app.use("/server/requests", requestRoute);
app.use("/server/bookings", bookingRoute);
app.use("/server/uploads", uploadRoute);
app.use("/server/utility", utilityRoute);
app.use("/server/conversations", conversationRoute);
app.use("/server/messages", messageRoute);

// start jobs processing
const agenda = createAgenda(process.env.MONGO_URI);
(async function () {
  await agenda.start();
})();

// Put your Socket.io code here:
socket.init(server);

const io = socket.getIO();

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log(userId);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // Add a new listener for 'startCountdown' events
  socket.on("startCountdown", async (requestId) => {
    console.log("we out here");
    const request = await Request.findById(requestId);
    if (!request || !request.acceptanceTimestamp) {
      return;
    }

    let timeElapsed = Date.now() - request.acceptanceTimestamp.getTime();
    let remainingTime = Math.max(0, 12 * 60 * 60 * 1000 - timeElapsed); // 12 hours in milliseconds
    let endTime = Date.now() + remainingTime;

    // Emit 'countdown' event to the client with end time
    socket.emit("countdown", endTime);
  });
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// port
const port = process.env.PORT || 8080;

// listener
server.listen(port, () => console.log(`Server is running on port ${port}`));
