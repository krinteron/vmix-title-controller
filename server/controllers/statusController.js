import fs from 'fs';
import axios from 'axios';
require('dotenv').config({ debug: true, override: true });

exports.get_status = async function (req, res) {
  const vmixData = fs.readFileSync('./vmixHost.json', 'utf8');
  const parsedData = JSON.parse(vmixData);
  const vmixHost = parsedData.host;
  const host = vmixHost + '/api/';
  const inputs = [];
  const activeTitles = {};
  try {
    await axios.get(host).then(({ data }) => {
      // Находим все оверлеи
      const overlays = String(data.match(/<overlay .*<\/overlays>/))
        .match(/>\d{1,5}<|\/></g)
        .map((item) => {
          const number = parseInt(item.replace(/\D/g, ''));
          return isNaN(number) ? '' : String(number);
        });
      // vmix имеет 4 первых оверлея для титров
      if (overlays.length > 4) overlays.length = 4;

      // Находим все инпуты, включая тексты и статус активности
      String(data.match(/<input .*inputs>/g))
        .split('</input>')
        .forEach((input) => {
          const textArray = String(input.match(/<text.*text>/g))
            .split(/Text\d\.Text">/g)
            .filter((n) => n)
            .map((item) => {
              const id = item.indexOf('<');
              return item.substring(0, id);
            });
          textArray.shift();
          const textData = textArray.join('#');

          const text = textData === 'null' ? '' : textData;

          const inputData = String(input.match(/<input [^>]*/g))
            .replace('<input ', '')
            .split('" ')
            .map((value) => value.replace(/"$/, '').split('="'));
          const { title, number } = Object.fromEntries(inputData);
          const result = {
            title,
            number,
            text,
          };
          if (title) {
            inputs.push(result);
          }
          if (overlays.includes(number)) {
            activeTitles[title] = text;
          }
        });

      res.json({ inputs, overlays, activeTitles });
    });
  } catch (e) {
    const vmixData = fs.readFileSync('./vmixHost.json', 'utf8');
    const parsedData = JSON.parse(vmixData);
    const vmixHost = parsedData.host;
    const error = {
      statusCode: 503,
      vmixHost,
    };
    res.json({ error });
  }
};
