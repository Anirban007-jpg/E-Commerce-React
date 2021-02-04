const express = require('express');
const postRoutes = require('./routes/post');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();

// db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true}).then(() => {
    console.log('database connected');
}).catch(err => {
    console.log(err);
});

mongoose.connection.on('error', err => {
    console.log(`Connection faild: ${err.message}`);
})


// MIDDLEWARES
app.use(morgan("dev"));

// Controllers

// bring in routes
app.use('/', postRoutes);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
})
