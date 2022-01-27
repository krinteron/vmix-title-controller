const { Router } = require('express');

// const { userBus } = require('../sse/userBus');
// const { processBus } = require('../sse/processBus');

const router = Router();
const controller = require('../controllers/statusController');

router.get('/status', controller.get_status);

// router.get('/current-status', function (req, res) {
//   console.log(33333);
//   userBus.emit('client-connected');
//   console.log('client connected');

//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('X-Accel-Buffering', 'no');
//   res.flushHeaders(); // flush the headers to establish SSE with client

//   console.log('sending');

//   processBus.on('status', (data) => {
//     const { inputs, overlays, activeTitles } = data;
//     res.write(
//       `data: ${JSON.stringify({ inputs, overlays, activeTitles })}\n\n`
//     );
//     res.flush();
//   });

//   res.on('close', () => {
//     console.log('client dropped me');

//     userBus.emit('client-diconnected');
//   });
// });

module.exports = router;
