// import modules
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const createAgenda = require('./jobs/jobs');
//const morgan = require('morgan');
const helmet = require("helmet");
require("dotenv").config();

const authRoute = require('./routes/auth');
const listingRoute = require('./routes/listings');
const userRoute = require('./routes/users');
const requestRoute = require('./routes/requests');
const bookingRoute = require('./routes/bookings');
const uploadRoute = require('./routes/uploads');
const utilityRoute = require('./routes/utility');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages')


// db
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Connected")).catch(err => console.log("DB Connection Error", err));


// middleware
app.use(express.json());
app.use(helmet());
//app.use(morgan("common"));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

// routes
app.use("/server/auth" , authRoute);
app.use("/server/listings" , listingRoute);
app.use("/server/users" , userRoute);
app.use("/server/requests", requestRoute);
app.use("/server/bookings", bookingRoute);
app.use("/server/uploads", uploadRoute);
app.use("/server/utility", utilityRoute);
app.use("/server/conversations", conversationRoute);
app.use("/server/messages", messageRoute);

// start jobs processing
const agenda = createAgenda(process.env.MONGO_URI);
(async function() { 
  await agenda.start(); 
})();

// port
const port = process.env.PORT || 8080;

// listener
    app.listen(port, () => 
    console.log(`Server is running on port ${port}`)
    );