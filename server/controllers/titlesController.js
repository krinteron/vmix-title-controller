import 'dotenv/config';
const fs = require('fs');
const SMB2 = require('@marsaud/smb2');

const smb2Client = new SMB2({
  share: '\\\\172.16.16.240\\vmix_store',
  domain: 'DOMAIN',
  username: 'username',
  password: 'password',
});

exports.get_titles = function (req, res) {
  const db = fs.readFileSync('./db2.json', 'utf8');
  let data = '';
  if (db) {
    data = JSON.parse(db);
  }
  res.json({ data });
};

exports.post_titles = function (req, res) {
  const data = req.body.data;
  fs.writeFileSync('./db2.json', JSON.stringify(data), 'utf8');
  res.json({});
};

exports.get_vmix_store = async function (req, res) {
  const photoPath = process.env.VMIX_STORE + process.env.VMIX_PHOTO;
  const titlesPath = process.env.VMIX_STORE + process.env.VMIX_TITLES;
  let photoNames = [];
  let titleNames = [];
  await new Promise((resolve) => {
    smb2Client.readdir('hrip_photo', (err, files) => {
      if (err) {
        console.log(err);
      }
      files.sort();
      photoNames = files;
      resolve();
    });
  });
  await new Promise((resolve) => {
    smb2Client.readdir('titles', (err, files) => {
      if (err) {
        console.log(err);
      }
      titleNames = files;
      resolve();
    });
  });
  const photo = {
    path: photoPath,
    values: photoNames,
  };
  const titles = {
    path: titlesPath,
    values: titleNames,
  };
  const data = {
    titles,
    photo,
  };
  res.json(data);
};

exports.set_vmix_host = function (req, res) {
  const host = req.body.data;

  fs.writeFileSync('./vmixHost.json', JSON.stringify({ host }), 'utf8');
  res.json({});
};
