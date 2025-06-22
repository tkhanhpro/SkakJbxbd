const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const downloadRoutes = require('./routes/download');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api', downloadRoutes);

// Serve index.html for all other routes (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
