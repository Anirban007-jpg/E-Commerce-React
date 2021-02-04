const express = require('express');
const { getPosts } = require('./routes/post');
const app = express();
const morgan = require('morgan');
const cors = require('cors');



// MIDDLEWARES
app.use(morgan("dev"));


// bring in routes
app.get('/', getPosts);

const port = process.env.PORT|| 5000

app.listen(port, () => {
    console.log(`Running on port ${port}`);
})
