const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'subscription-tracker-api',
    environment: env.nodeEnv,
  });
});

module.exports = app;
