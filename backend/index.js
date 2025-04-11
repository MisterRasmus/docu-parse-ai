// Main Express server for DocuParse backend

const express = require('express');
const cors = require('cors');
const parseRouter = require('./routes/parse');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/parse', parseRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DocuParse backend running on port ${PORT}`);
});