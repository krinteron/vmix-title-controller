const fs = require('fs');
const path = '\\\\172.16.16.240\\vmix_store\\hrip_photo';
const data = fs.readdirSync(path);
console.log(data);
