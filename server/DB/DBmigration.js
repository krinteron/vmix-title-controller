import 'dotenv/config';
const fs = require('fs');

const dbPath = process.env.DB;

const data = {
  programs: {},
  components: {},
};

fs.writeFileSync(dbPath, JSON.stringify(data));
