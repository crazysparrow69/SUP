const db = require('./config/db_connection');
const express = require('express');
const app = express();

// Global variables
const PORT = 3500;

// Built-in middleware for json
app.use(express.json());

// Routes
app.use('/api', require('./routes/apiRoute'));

// Connection
db.connect(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)));