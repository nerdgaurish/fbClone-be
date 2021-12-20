const express = require('express');
require('dotenv').config();
const { connectDB } = require('./db/connect');
const userRoutes = require('./routes/userRoutes');

const app = express();
// middleware
app.use(express.json());

// routes
app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log('listening on port', PORT));
  }
  catch (error) {
    console.error(error.message);
  }
};

startServer();
