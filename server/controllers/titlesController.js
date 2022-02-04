const fs = require('fs');

exports.get_titles = function (req, res) {
  const db = fs.readFileSync('./db2.json', 'utf8');
  const data = JSON.parse(db);
  res.json({ data });
};

exports.post_titles = function (req, res) {
  const data = req.body.data;
  fs.writeFileSync('./db2.json', JSON.stringify(data), 'utf8');
  res.json({});
};
