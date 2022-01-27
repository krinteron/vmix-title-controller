const fs = require('fs')
const data = [
  {
    id: '1bsdfd69163a-cd-9eab-13c66dvdsea8fbb5',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '1b69163a-c6b3-4f8d-9eab-13c66ea8fbb5',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: '056d49d1-97e1-4051-9d79-580a5175a12d',
        value: 'Иван Иванов'
      },
      {
        type: 'geo',
        isActive: false,
        id: '33fc8456-8a0e-40be-990e-e1411305d624',
        value: 'Москва'
      },
      {
        type: 'source',
        isActive: false,
        id: 'b148c4244a7f4453b3d4af3ee6483345',
        value: 'Газета'
      }
    ],
  },
  {
    id: '9505d645b6b3497bbc48d596ab29d99b',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '32cc5e692b204efda07d07bc1c235b82',
        value: ''
      },
      {
        type: 'fio',
        isActive: false,
        id: '91d16e38938749b0ad6b6988d7d9fc11',
        value: ''
      },
      {
        type: 'geo',
        isActive: false,
        id: '99ba3ac6bc7f4d34a9bedd2eec080748',
        value: ''
      },
      {
        type: 'source',
        isActive: false,
        id: '049f241524f7463cab2b340985726471',
        value: ''
      }
    ],
  },
  {
    id: '5f4c2c6586e043789471afe60eee8de3',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: 'c7586e53d025416099b652a9e61ce1ec',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: '576e2e6e86344fb5a1046ff622a7bec5',
        value: 'Иван Иванов'
      },
      {
        type: 'geo',
        isActive: false,
        id: 'da330ac948f94fe8970270f24cc89936',
        value: 'Москва'
      },
      {
        type: 'source',
        isActive: false,
        id: '2f8464615d5f43e4a8e62675dd63fd47',
        value: 'Газета'
      }
    ],
  },
  {
    id: 'd7d5e5e004db4f88965aba8f1a0cf257',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '8a2091132d774820a3995560420e2176',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: 'a6483a18b0384e88af304a1e1e94a461',
        value: ''
      },
      {
        type: 'geo',
        isActive: false,
        id: 'a3af8936b71d4c3f90d6b254829429ad',
        value: 'Москва'
      },
      {
        type: 'source',
        isActive: false,
        id: '1ee0615f5da743f7a2ec0fb75b6fbd5d',
        value: 'Газета'
      }
    ],
  },
  {
    id: '4ea01d8bc42847f9a4bab34b6c14296b',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '07d03065e8454726924346b31061c78e',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: 'deda5a765fa64407ab505b86d285e5dd',
        value: 'Иван Иванов'
      },
      {
        type: 'geo',
        isActive: false,
        id: 'ad41d94e37594dc897252fcfd4948bfe',
        value: 'Москва'
      },
      {
        type: 'source',
        isActive: false,
        id: '94cdc7b9f9fc44059830a51586a3f559',
        value: 'Газета'
      }
    ],
  },
  {
    id: '20e8a56f8b734f26817c18461e3bde16',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: 'c53e18f628054437aa77eefcc1f37fc2',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: '01e8e7245865424bb9943640c4302695',
        value: ''
      },
      {
        type: 'geo',
        isActive: false,
        id: '534a92ff340d4062826d6baf2e620dad',
        value: ''
      },
      {
        type: 'source',
        isActive: false,
        id: '18882757c5374b67b58243e850ef32b9',
        value: 'Газета'
      }
    ],
  },
  {
    id: '82e84571a22e45d59af3dbb394bd1e39',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '7ed432e833864cafb803b2f78580b851',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: 'a1fe51a629ad41ba9a14b91109484bf9',
        value: 'Иван Иванов'
      },
      {
        type: 'geo',
        isActive: false,
        id: 'b7f88bda6c4f424a9f8b6378a5f50f4d',
        value: 'Москва'
      },
      {
        type: 'source',
        isActive: false,
        id: 'a601257a32344360aaab7a52fd6b7079',
        value: 'Газета'
      }
    ],
  },
  {
    id: 'aaca51817d7844bcbbcfce7cac47cab2',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: '0ccb783d3dd0495b9140a4884d0b1f2b',
        value: 'самолет'
      },
      {
        type: 'fio',
        isActive: false,
        id: '10e86af0b3554ef885db3f7ead4047b2',
        value: 'Иван Иванов'
      },
      {
        type: 'geo',
        isActive: false,
        id: '2ee137f821d14b59a0e8882e972ab9a4',
        value: ''
      },
      {
        type: 'source',
        isActive: false,
        id: '698f367575d9414db09a7904d9dc0273',
        value: 'Газета'
      }
    ],
  },
  {
    id: '9c780eb86a034abd9259704e4e354d06',
    value: [
      {
        type: 'tema',
        isActive: false,
        id: 'f4c14b4001d64743a09cb83bf0919767',
        value: ''
      },
      {
        type: 'fio',
        isActive: false,
        id: '9f0efb03e9194f108f2d9f313b460a91',
        value: ''
      },
      {
        type: 'geo',
        isActive: false,
        id: 'c35a4d87a99a4f7b9fd67cc0cfecf5bf',
        value: ''
      },
      {
        type: 'source',
        isActive: false,
        id: 'bbd279ff1d7a44a395392f75c76dac5a',
        value: ''
      }
    ],
  },
];
fs.writeFileSync('./db.json', JSON.stringify(data));