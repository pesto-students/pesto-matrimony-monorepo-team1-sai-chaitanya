const mongoose = require('mongoose');


const dbStringKarthik = "mongodb+srv://karthik:justdothis@cluster0.6byma.mongodb.net/messaging?retryWrites=true&w=majority";

const dbStirngPesoMatrimony = "mongodb+srv://pmdbadmin:pmdbpassword@pestomatrimony.1i3axf5.mongodb.net/?retryWrites=true&w=majority"

const dbConnection = async () => {
  console.log('Connecting to mongoDB...');
  const connection = await mongoose.connect(dbStirngPesoMatrimony, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connection successful !`);
};

module.exports = dbConnection;
