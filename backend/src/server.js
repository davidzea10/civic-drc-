// Entry point backend
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { testConnection } = require('./db/client');
const authRoutes = require('./routes/auth');
const ministriesRoutes = require('./routes/ministries');
const provincesRoutes = require('./routes/provinces');
const proposalsRoutes = require('./routes/proposals');
const adminProposalsRoutes = require('./routes/adminProposals');

app.use('/auth', authRoutes);
app.use('/ministries', ministriesRoutes);
app.use('/provinces', provincesRoutes);
app.use('/proposals', proposalsRoutes);
app.use('/admin/proposals', adminProposalsRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CIVIC-DRC backend running' });
});

// Test connexion base Supabase (pour Postman)
app.get('/db-test', async (req, res) => {
  try {
    const result = await testConnection();
    if (result.ok) {
      return res.json({ ok: true, message: result.message });
    }
    const errorMsg = result.error || result.message || 'Erreur inconnue';
    return res.status(500).json({ ok: false, error: errorMsg });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
