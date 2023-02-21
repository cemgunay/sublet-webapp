// import modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require("helmet");
require("dotenv").config();

const authRoute = require('./routes/auth');

// db
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Connected")).catch(err => console.log("DB Connection Error", err));


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/server/auth" , authRoute);

// port
const port = process.env.PORT || 8080;

// listener
    app.listen(port, () => 
    console.log(`Server is running on port ${port}`)
    );