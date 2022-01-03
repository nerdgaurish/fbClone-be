const express = require('express');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { connectDB } = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const swaggerDocument = require('./swagger.json');

const app = express();
// middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

// routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', postRoutes);

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
