const mongoose = require('mongoose');

const dbConnection = async () => {
  console.log('Connecting to mongoDB...');
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connection successful !`);
};

module.exports = dbConnection;
