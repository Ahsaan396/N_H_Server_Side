const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (Replace with your URI or use local)
mongoose.connect('mongodb://127.0.0.1:27017/shopDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));