const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorMiddleware);

module.exports = app;