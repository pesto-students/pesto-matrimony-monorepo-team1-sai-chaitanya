const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('./config/database');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
dbConnection();

// Start Express Server
const app = express();

app.use(cors());

app.use(express.json());

// importing routes
const users = require('./routes/users.js');
const conversations = require('./routes/conversations.js');

// mounting routes
app.use('/api/v1/users', users);
app.use('/api/v1/conversations', conversations);

// error Handler
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
