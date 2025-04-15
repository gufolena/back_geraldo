// ================ config/db.js ================

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false); 

const connectDB = async () => {
  try {
    const { 
      MONGO_USER, 
      MONGO_PASSWORD, 
      MONGO_CLUSTER, 
      MONGO_DB,
      MONGO_OPTIONS 
    } = process.env;

    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB}${MONGO_OPTIONS}`;

    const conn = await mongoose.connect(mongoURI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
