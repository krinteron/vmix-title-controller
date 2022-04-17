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
    await axios.get(host).then(async ({ data }) => {
      const payload = await parser(data);
      res.json(payload);
    });
  } catch (e) {
    // console.log(e);
    const vmixData = fs.readFileSync(vMixHostPath, 'utf8');
    const parsedData = JSON.parse(vmixData);
    const vmixHost = parsedData.host;
    res.status(503).json({
      error: {
        status: 503,
        message:
          "The vmix doesn't seem to be running, or an invalid address has been specified.",
        payload: vmixHost,
      },
    });
    // const error = {
    //   statusCode: 503,
    //   vmixHost,
    // };
    // res.json({ error });
  }
};
