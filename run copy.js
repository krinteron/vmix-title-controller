const fs = require('fs');

const data = {
  'Здесь и сейчас': {
    programName: 'Здесь и сейчас',
    titlers: {
      mainTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ТЕМА',
            titleName: 'NEWS_theme_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 1,
          },
          2: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 1,
          },
        },
      },
      sourceTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ГЕО',
            titleName: 'NEWS_geo_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
          2: {
            name: 'ИСТОЧНИК',
            titleName: 'NEWS_source_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
    },
  },
  'еще не время': {
    programName: 'Здесь и сейчас',
    titlers: {
      mainTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ТЕМА',
            titleName: 'NEWS_theme_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 1,
          },
          2: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 1,
          },
          3: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 3,
          },
        },
      },
      sourceTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ГЕО',
            titleName: 'NEWS_geo_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
          2: {
            name: 'ИСТОЧНИК',
            titleName: 'NEWS_source_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
    },
  },
  'И так далее': {
    programName: 'И так далее',
    titlers: {
      mainTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ТЕМА',
            titleName: 'NEWS_theme_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 1,
          },
          2: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 1,
          },
        },
      },
      geoTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ГЕО',
            titleName: 'NEWS_geo_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
      sourceTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ИСТОЧНИК',
            titleName: 'NEWS_source_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
      sourTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ИСТОЧНИК',
            titleName: 'NEWS_source_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
    },
  },
  'Еще не вечер': {
    programName: 'Еще не вечер',
    titlers: {
      mainTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ТЕМА',
            titleName: 'NEWS_theme_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 1,
          },
          2: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 1,
          },
        },
      },
      geoTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ГЕО',
            titleName: 'NEWS_geo_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
        },
      },
      sourceTitler: {
        titlerComponentName: 'MainTitle',
        dataOrder: {
          1: {
            name: 'ИСТОЧНИК',
            titleName: 'NEWS_source_vmix.gtzip',
            autoClose: false,
            upperCase: true,
            overlayInput: 2,
          },
          2: {
            name: 'ФИО',
            titleName: 'NEWS_name_vmix.gtzip',
            autoClose: true,
            upperCase: true,
            overlayInput: 1,
          },
        },
      },
    },
  },
};

// const data = {
//   nullest: {
//     dataOrder: {
//       1: {
//         name: 'ТЕМА',
//         titleName: 'NEWS_theme_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       2: {
//         name: 'ФИО',
//         titleName: 'NEWS_name_vmix.gtzip',
//         autoClose: true,
//         upperCase: true,
//         overlayInput: 1,
//       },
//     },
//   },
//   first: {
//     dataOrder: {
//       1: {
//         name: 'ТЕМА',
//         titleName: 'NEWS_theme_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       2: {
//         name: 'ФИО',
//         titleName: 'NEWS_name_vmix.gtzip',
//         autoClose: true,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       3: {
//         name: 'ГЕО',
//         titleName: 'NEWS_geo_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 2,
//       },
//     },
//   },
//   second: {
//     dataOrder: {
//       1: {
//         name: 'ТЕМА',
//         titleName: 'NEWS_theme_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       2: {
//         name: 'ФИО',
//         titleName: 'NEWS_name_vmix.gtzip',
//         autoClose: true,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       3: {
//         name: 'ГЕО',
//         titleName: 'NEWS_geo_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 2,
//       },
//       4: {
//         name: 'ИСТОЧНИК',
//         titleName: 'NEWS_source_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 2,
//       },
//     },
//     values: [
//       {
//         id: '1bsdfd69163a-cd-9eab-13ch66dvdsea8fbb5',
//         value: [
//           {
//             id: '1b69163a-c6b3-4f8d-9e7ab-13c66ea8fbb5',
//             column: 1,
//             value: 'ОБЛАСТЬ',
//           },
//           {
//             id: '056d49d1-97e1-4051-95d79-580a5175a12d',
//             column: 2,
//             value: 'ПЕТР СТЕПАНОВ#СОЛДАТ',
//           },
//           {
//             id: '33fc8456-8a0e-40be-9930e-e1411305d624',
//             column: 3,
//             value: '',
//           },
//           {
//             id: 'b148c4244a7f4453b3d4af32ee6483345',
//             column: 4,
//             value: '',
//           },
//         ],
//       },
//       {
//         id: '9505d645b6b3497bbc48d5l96ab29d99b',
//         value: [
//           {
//             id: 'f4b86c25-9e90-4ca2-b2a19-427f5bdfe780',
//             column: 1,
//             value: '',
//           },
//           {
//             id: '66de4bb1-a37a-402b-adfda-0746a19cb1dd',
//             column: 2,
//             value: '',
//           },
//           {
//             id: '1fb298a52-ff9b-4b6e-80f7-da72b2378868',
//             column: 3,
//             value: '',
//           },
//           {
//             id: '872e2496-8cab-4e8a-8431-bb7ca38664915',
//             column: 4,
//             value: '',
//           },
//         ],
//       },
//     ],
//   },
//   third: {
//     dataOrder: {
//       1: {
//         name: 'ТЕМА',
//         titleName: 'NEWS_theme_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       2: {
//         name: 'ФИО',
//         titleName: 'NEWS_name_vmix.gtzip',
//         autoClose: true,
//         upperCase: true,
//         overlayInput: 1,
//       },
//       3: {
//         name: 'ГЕО',
//         titleName: 'NEWS_geo_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 2,
//       },
//       4: {
//         name: 'ИСТОЧНИК',
//         titleName: 'NEWS_source_vmix.gtzip',
//         autoClose: false,
//         upperCase: true,
//         overlayInput: 2,
//       },
//     },
//     values: [
//       {
//         id: '1bsdfd6913463a-cd-9eab-13c66dvdsea8fbb5',
//         value: [
//           {
//             id: '1b69163a-c6b3-4f8d-9eab-1356c66ea8fbb5',
//             column: 1,
//             value: 'ИВАН ИВАНОВ#ВОДИТЕЛЬ',
//           },
//           {
//             id: '056d49d1-97e1-4051-9d79-580a513475a12d',
//             column: 2,
//             value: 'ИВАН ИВАНОВ#ВОДИТЕЛЬ',
//           },
//           {
//             id: '33fc845236-8a0e-40be-990e-e1411305d624',
//             column: 3,
//             value: 'ИВАН ИВАНОВ#ВОДИТЕЛЬ',
//           },
//           {
//             id: 'b148c4244a7f445443b3d4af3ee6483345',
//             column: 4,
//             value: '',
//           },
//         ],
//       },
//       {
//         id: '9505d645b6b3497bbc4855d596ab29d99b',
//         value: [
//           {
//             id: 'f4b86c25-9e90-4ca2-b2gd19-427f5bdfe780',
//             column: 1,
//             value: '',
//           },
//           {
//             id: '66de4bb1-a37a-402b-adda-0746awq19cb1dd',
//             column: 2,
//             value: '',
//           },
//           {
//             id: '1fb29852-ff9b-4b6e-80f7-da72b2378be868',
//             column: 3,
//             value: '',
//           },
//           {
//             id: '872e2496-8cab-4e8a-8431-bb7ca386ot6915',
//             column: 4,
//             value: '',
//           },
//         ],
//       },
//     ],
//   },
// };
fs.writeFileSync('./db1.json', JSON.stringify(data));
