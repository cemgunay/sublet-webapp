// import modules
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require("helmet");
require("dotenv").config();

const authRoute = require('./routes/auth');
const listingRoute = require('./routes/listings');
const userRoute = require('./routes/users');

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

// port
const port = process.env.PORT || 8080;

// listener
    app.listen(port, () => 
    console.log(`Server is running on port ${port}`)
    );