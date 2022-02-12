const fs = require('fs');
const data = {
  programs: {
    '657556-23434-43543': {
      programName: 'Еще не время',
      id: '657556-23434-43543',
      order: [
        '543435-45326-84674',
        '55ab0830-4b8f-4f90-bdce-d21d1a684c4c',
        '7049028b-1ddb-4179-b292-5479180194c9',
        'ed0c7152-04af-449d-8362-cb0f50ca329d',
      ],
    },
  },
  components: {
    '543435-45326-84674': {
      id: '543435-45326-84674',
      programId: '657556-23434-43543',
      titlerComponentName: 'MainTitle',
      columns: {
        '435244-436654-32426': {
          id: '435244-436654-32426',
          name: 'ГЕО',
          filename: 'NEWS_geo_vmix.gtzip',
          autoclose: false,
          uppercase: true,
          overlay: 2,
        },
        '55645-fgfgfg-12353': {
          id: '55645-fgfgfg-12353',
          name: 'ИСТОЧНИК',
          filename: 'NEWS_source_vmix.gtzip',
          autoclose: true,
          uppercase: true,
          overlay: 2,
        },
      },
      rows: [
        {
          id: 'd57103b0-f8bf-47fe-aeaf-fa98a123735b',
          value: [
            {
              id: '6ab3f672-ddb3-498b-94e8-dd2b9510c826',
              columnId: '435244-436654-32426',
              value: '',
            },
            {
              id: '16596940-fa91-4b49-a9b9-24a4f9842755',
              columnId: '55645-fgfgfg-12353',
              value: '',
            },
          ],
        },
        {
          id: '5f6a89ca-fac6-4c12-9b15-43916f4e3c77',
          value: [
            {
              id: '5804ac02-672a-41be-8db9-cab696aaa3d7',
              columnId: '435244-436654-32426',
              value: '',
            },
            {
              id: 'b739bfc9-1f15-4b2d-bdc2-6dd486badcdb',
              columnId: '55645-fgfgfg-12353',
              value: '',
            },
          ],
        },
        {
          id: '0d3c68ce-8175-4876-9900-da24f3bbc1a4',
          value: [
            {
              id: '1b8a0904-52bb-42b8-bf75-ff0603e00a93',
              columnId: '435244-436654-32426',
              value: '',
            },
            {
              id: 'a8e9b5e4-559b-4403-9117-784b9da88be3',
              columnId: '55645-fgfgfg-12353',
              value: '',
            },
          ],
        },
        {
          id: 'c00f539d-1f36-4c5c-92ee-824c10b7f265',
          value: [
            {
              id: '5b835082-0e4b-47c8-aeac-1b18313e5673',
              columnId: '435244-436654-32426',
              value: '',
            },
            {
              id: 'b2bfeb79-9449-4bf2-828f-5dd05ec324fe',
              columnId: '55645-fgfgfg-12353',
              value: '',
            },
          ],
        },
        {
          id: '3399502f-c2b2-44f7-a11d-77a98290cf52',
          value: [
            {
              id: '047e38fd-73ae-44a4-9b61-949be01ad023',
              columnId: '435244-436654-32426',
              value: 'MOSCOW',
            },
            {
              id: '5533c0fe-7472-44ce-a26b-d10bf96b32e8',
              columnId: '55645-fgfgfg-12353',
              value: '',
            },
          ],
        },
        {
          id: '9ea08295-f6dd-47f8-bb44-d224cd1ee1ef',
          value: [
            {
              id: '1c613b2a-96c8-4060-bbb4-d657349b5c9b',
              columnId: '435244-436654-32426',
              value: '',
            },
            {
              id: '846efa9d-9533-414a-93ad-607ade90b2fb',
              columnId: '55645-fgfgfg-12353',
              value: 'TIMES',
            },
          ],
        },
      ],
    },
    '55ab0830-4b8f-4f90-bdce-d21d1a684c4c': {
      id: '55ab0830-4b8f-4f90-bdce-d21d1a684c4c',
      programId: '657556-23434-43543',
      titlerComponentName: 'Button',
      columns: {
        '9cc4a8bc-d20c-4306-8af5-ebb453920e9d': {
          id: '9cc4a8bc-d20c-4306-8af5-ebb453920e9d',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '3295208d-568e-4850-b07c-ff762b925749': {
          id: '3295208d-568e-4850-b07c-ff762b925749',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '3013fdb0-180c-4572-99cc-ba340fd829eb': {
          id: '3013fdb0-180c-4572-99cc-ba340fd829eb',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        'ad9747f4-56b8-48c9-b6ae-1655ffbbb29e': {
          id: 'ad9747f4-56b8-48c9-b6ae-1655ffbbb29e',
          name: 'newButton',
          color: 'success',
          filename: 'hrip.gtzip',
          overlay: 4,
          autoclose: false,
        },
        '9de4d0d9-f4a0-4071-9479-432ad3ff6b89': {
          id: '9de4d0d9-f4a0-4071-9479-432ad3ff6b89',
          name: 'newButton',
          color: 'dark',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        'adc9331f-af35-4ee8-ab79-88f2aec0a31d': {
          id: 'adc9331f-af35-4ee8-ab79-88f2aec0a31d',
          name: 'newButton',
          color: 'warning',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '90bf74d4-046a-4c2e-8676-f79b1228ed67': {
          id: '90bf74d4-046a-4c2e-8676-f79b1228ed67',
          name: 'newButton',
          color: 'info',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        'cf6503e8-b8c4-46b5-a5a8-27a9140434d1': {
          id: 'cf6503e8-b8c4-46b5-a5a8-27a9140434d1',
          name: 'newButton',
          color: 'danger',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        'f0fdaa06-fb5e-4412-a306-324aca8ed4ed': {
          id: 'f0fdaa06-fb5e-4412-a306-324aca8ed4ed',
          name: 'newButton',
          color: 'danger',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '35f795d2-7675-4977-b288-419c5ba08c52': {
          id: '35f795d2-7675-4977-b288-419c5ba08c52',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '49a45953-2dab-458b-852f-5eb2262ac517': {
          id: '49a45953-2dab-458b-852f-5eb2262ac517',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '49e17bd5-4fe8-486f-a714-e493b82f6a86': {
          id: '49e17bd5-4fe8-486f-a714-e493b82f6a86',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        'dcdb1873-3e1e-4473-9693-2f1f4ec2da5b': {
          id: 'dcdb1873-3e1e-4473-9693-2f1f4ec2da5b',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '512ca835-3ec0-4849-9a4a-9409c19d6ca5': {
          id: '512ca835-3ec0-4849-9a4a-9409c19d6ca5',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
        '227e76ad-d4c3-4718-8f82-aca7eb9859e8': {
          id: '227e76ad-d4c3-4718-8f82-aca7eb9859e8',
          name: 'newButton',
          color: 'secondary',
          filename: '',
          overlay: 4,
          autoclose: false,
        },
      },
      rows: [],
    },
    'ed0c7152-04af-449d-8362-cb0f50ca329d': {
      id: 'ed0c7152-04af-449d-8362-cb0f50ca329d',
      programId: '657556-23434-43543',
      titlerComponentName: 'Quad',
      columns: {
        topLeft: {
          1: {
            id: '1',
            firstname: '',
            lastname: '',
          },
          2: {
            id: '2',
            firstname: '',
            lastname: '',
          },
          3: {
            id: '3',
            firstname: '',
            lastname: '',
          },
          4: {
            id: '4',
            firstname: '',
            lastname: '',
          },
        },
        topRight: {
          1: {
            id: '1',
            firstname: '',
            lastname: '',
          },
          2: {
            id: '2',
            firstname: '',
            lastname: '',
          },
          3: {
            id: '3',
            firstname: '',
            lastname: '',
          },
          4: {
            id: '4',
            firstname: '',
            lastname: '',
          },
        },
        bottomLeft: {
          1: {
            id: '1',
            firstname: '',
            lastname: '',
          },
          2: {
            id: '2',
            firstname: '',
            lastname: '',
          },
          3: {
            id: '3',
            firstname: '',
            lastname: '',
          },
          4: {
            id: '4',
            firstname: '',
            lastname: '',
          },
        },
        bottomRight: {
          1: {
            id: '1',
            firstname: '',
            lastname: '',
          },
          2: {
            id: '2',
            firstname: '',
            lastname: '',
          },
          3: {
            id: '3',
            firstname: '',
            lastname: '',
          },
          4: {
            id: '4',
            firstname: '',
            lastname: '',
          },
        },
      },
      rows: [],
      resultString: '',
      filename: '',
      overlay: 1,
      autoclose: false,
    },
    '7049028b-1ddb-4179-b292-5479180194c9': {
      id: '7049028b-1ddb-4179-b292-5479180194c9',
      programId: '657556-23434-43543',
      titlerComponentName: 'Hrip',
      columns: {
        1: {
          id: '1',
          name: '',
          job: '',
          photo: '',
        },
        2: {
          id: '2',
          name: '',
          job: '',
          photo: '',
        },
        3: {
          id: '3',
          name: '',
          job: '',
          photo: '',
        },
        4: {
          id: '4',
          name: '',
          job: '',
          photo: '',
        },
        5: {
          id: '5',
          name: '',
          job: '',
          photo: '',
        },
        6: {
          id: '6',
          name: '',
          job: '',
          photo: '',
        },
        7: {
          id: '7',
          name: '',
          job: '',
          photo: '',
        },
        8: {
          id: '8',
          name: '',
          job: '',
          photo: '',
        },
        9: {
          id: '9',
          name: '',
          job: '',
          photo: '',
        },
      },
      rows: [],
      resultString: '',
      filename: '',
      overlay: 1,
      autoclose: false,
    },
  },
};

fs.writeFileSync('./db2.json', JSON.stringify(data));
