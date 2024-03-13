const express = require('express');
const app = express();
require('dotenv').config();
const route = require('./route');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
app.use('/', route);

// Start the server
app.listen(process.env.PORT || 3010, () => {
    console.log(`Server is running on port ${process.env.PORT || 3010}`);
});
