const cors = require('cors');
const express = require('express');
const dbConnection = require('./config/database');
const errorHandler = require('./middleware/error');
const bodyParser = require('body-parser');

// Connect to MongoDB
dbConnection();

// Start Express Server
const app = express();

app.use(cors());

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// importing routes
const admin = require('./routes/admin.js');
const conversations = require('./routes/conversations.js');
const interests = require('./routes/interests.js');
const recommendations = require('./routes/recommendations.js');
const search = require('./routes/search.js');
const toggleShortlist = require('./routes/shortlist.js');
const users = require('./routes/users.js');

// mounting routes
app.use('/api/v1/admin', admin);
app.use('/api/v1/conversations', conversations);
app.use('/api/v1/interests', interests);
app.use('/api/v1/recommendations', recommendations);
app.use('/api/v1/search', search);
app.use('/api/v1/toggleShortlist', toggleShortlist);
app.use('/api/v1/users', users);

console.log('mounting routes completed...');


//Handling Unhandled routes. it should be placed after the routes.
app.all( '*',( req , res , next ) => {
  res.status ( 404 ).json({
    status : ' fail ',
    message : `Can't find $ { req.originalUrl ) on this server !`
 })
});

// error Handling middlewre.
app.use(errorHandler);

const server = app.listen(
  process.env.PORT || 8000,
  console.log(`Server is listening on port : ${process.env.PORT || 8000}\nMode: ${process.env.NODE_ENV.toUpperCase()}`)
);

// Error in connecting to MongoDB triggers unhandledRejection at global level
// That is being handled here. This stops server if MongoDB is NOT connected.
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
