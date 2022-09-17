const cors = require('cors');
const express = require('express');
const dbConnection = require('./config/database');
const errorHandler = require('./middleware/error');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

// Connect to MongoDB
dbConnection();

// Start Express Server
const app = express();

// *****************Sentry Code Start*****************
// Sentry.init({
//   dsn: 'https://e1d7d0bf5be74e7b99f42b24a991095a@o1408574.ingest.sentry.io/6744194',
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Tracing.Integrations.Express({ app }),
//   ],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// // RequestHandler creates a separate execution context using domains, so that every
// // transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

// *****************Sentry Code End*****************

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

// *****************Sentry Related*****************
// Sentry Error Handler
// The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());

// *****************Sentry Related*****************

// Custom Error Handler

//Handling Unhandled routes. it should be placed after the routes.
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server !`,
//   });
// });

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
