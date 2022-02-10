import 'dotenv/config';
const express = require('express');
const compression = require('compression');

const app = express();

const titles = require('./routes/titles');
const status = require('./routes/status');
const storage = require('./routes/storage');
const vmixStore = require('./routes/vmixStore');

app.use(express.json());
app.use(compression());
app.use(titles);
app.use(status);
app.use(storage);
app.use(vmixStore);

module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
