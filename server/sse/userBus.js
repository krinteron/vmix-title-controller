// import fs from 'fs';
// import axios from 'axios';
// import 'dotenv/config';

// const EventEmitter = require('events');

// const { processBus } = require('./processBus');

// const bus = new EventEmitter();
// let sendIntervalID = null;
// const host = process.env.VMIX_HOST + '/api/';
// let counter = 0;
// let status;

// // generate event object
// setInterval(async () => {
//   await axios.get(host).then(({ data }) => {
//     const inputs = [];
//     const activeTitles = {};

//     const overlays = String(data.match(/<overlay .*<\/overlays>/))
//       .match(/>\d{1,5}<|\/></g)
//       .map((item) => {
//         const number = parseInt(item.replace(/\D/g, ''));
//         return isNaN(number) ? '' : String(number);
//         // return String(parseInt(item.replace(/\D/g, ''))) || false;
//       });
//     // vmix имеет 4 первых оверлея для титров
//     if (overlays.length > 4) overlays.length = 4;

//     // Находим все инпуты, включая тексты и статус активности
//     String(data.match(/<input .*inputs>/g))
//       .split('</input>')
//       .forEach((input) => {
//         const textData = String(input.match(/<text.*text>/g))
//           .split('</text>')
//           .filter((n) => n)
//           .map((item) => {
//             const id = item.indexOf('>');
//             return item.substring(id + 1);
//           })
//           .join('#');

//         const text = textData === 'null' ? '' : textData;

//         const inputData = String(input.match(/<input [^>]*/g))
//           .replace('<input ', '')
//           .split('" ')
//           .map((value) => value.replace(/"$/, '').split('="'));
//         const { title, number } = Object.fromEntries(inputData);
//         const result = {
//           title,
//           number,
//           text,
//         };
//         inputs.push(result);
//         if (overlays.includes(number)) {
//           activeTitles[title] = text;
//         }
//       });
//     // Находим все оверлеи

//     status = { inputs, overlays, activeTitles };
//   });
// }, 1000);

// bus.on('client-connected', () => {
//   if (counter === 0) {
//     bus.emit('start-monitoring');
//   }
//   counter++;
// });
// bus.on('client-diconnected', () => {
//   counter--;
//   if (counter === 0) {
//     clearInterval(sendIntervalID);
//   }
// });
// bus.on('start-monitoring', () => {
//   clearInterval(sendIntervalID);
//   sendIntervalID = setInterval(() => {
//     processBus.emit('status', status);
//   }, 1000);
// });

// module.exports = {
//   userBus: bus,
// };
