import fs from 'fs';
import 'dotenv/config';
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const vMixHostPath = process.env.VMIXHOST;

const titles = require('./routes/titles');
const status = require('./routes/status');
const vmixStore = require('./routes/vmixStore');

const getVmixHost = () => {
  const vmixData = fs.readFileSync(vMixHostPath, 'utf8');
  const parsedData = JSON.parse(vmixData);
  return parsedData.host;
};

app.use(express.json());
app.use(titles);
app.use(status);
app.use(vmixStore);
app.use(
  '/api/',
  createProxyMiddleware({ target: getVmixHost(), changeOrigin: true })
);

module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
