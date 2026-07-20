/* EXPRESS SERVER — ENTRY POINT (Phase 9 mein routes connect honge) */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// TODO Phase 9: connect routes here
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
