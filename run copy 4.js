const fs = require('fs');
const data = {
  host: 'http://172.16.16.230:8088',
};

fs.writeFileSync('./vmixHost.json', JSON.stringify(data));
