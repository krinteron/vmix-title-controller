import 'dotenv/config';
import fs from 'fs';
import axios from 'axios';
import parser from '../utils/xmlParser';

const vMixHostPath = process.env.VMIXHOST;

exports.get_status = async function (req, res) {
  const vmixData = fs.readFileSync(vMixHostPath, 'utf8');
  const parsedData = JSON.parse(vmixData);
  const vmixHost = parsedData.host;
  const host = vmixHost + '/api/';
  try {
    await axios.get(host).then(({ data }) => {
      const payload = parser(data);
      res.json(payload);
    });
  } catch (e) {
    const vmixData = fs.readFileSync(vMixHostPath, 'utf8');
    const parsedData = JSON.parse(vmixData);
    const vmixHost = parsedData.host;
    const error = {
      statusCode: 503,
      vmixHost,
    };
    res.json({ error });
  }
};
