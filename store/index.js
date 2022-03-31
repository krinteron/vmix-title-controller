import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import axios from 'axios';
import qs from 'qs';

import StateMachine from './utils/StateMachine';

Vue.use(Vuex);

function run(overlayInput, data) {
  const { currentInputNumber, value, photo } = data;
  const textValues = value.split('#');
  const sendText = async (index) => {
    if (index >= textValues.length + 1) {
      if (!photo || !photo.values.length) {
        return;
      } else {
        return await sendPhoto(0);
      }
    }
    const options = {
      url: '/api/',
      method: 'post',
      data: qs.stringify({
        Function: 'SetText',
        Input: currentInputNumber,
        SelectedName: `Text${index + 1}.Text`,
        Value: textValues[index],
      }),
    };
    await axios(options);
    sendText(index + 1);
  };

  const sendPhoto = async (index) => {
    const photoValues = photo.values;
    if (index >= photoValues.length) return;
    let filename = photo.path + photoValues[index];
    if (!photoValues[index]) {
      filename = '';
    }
    const options = {
      url: '/api/',
      method: 'post',
      data: qs.stringify({
        Function: 'SetImage',
        Input: currentInputNumber,
        SelectedName: `Image${index + 1}.Source`,
        Value: filename,
      }),
    };
    await axios(options);
    sendPhoto(index + 1);
  };

  return sendText(0).then(() => {
    axios.post(
      '/api/',
      qs.stringify({
        Function: `OverlayInput${overlayInput}`,
        Input: currentInputNumber,
      })
    );
  });
}

function stop(overlayInput) {
  return axios.post(
    '/api/',
    qs.stringify({
      Function: `OverlayInput${overlayInput}Out`,
    })
  );
}

const store = () =>
  new Store({
    state: {
      stateMachine: '',
      intervalID: '',
      vmixState: {},
      vmixStore: {},
      editMode: false,
      vmixIsOnline: true,
      vmixHost: '',
      db: {},
      programs: {},
      vmixOverlays: [
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
      ],
      colors: [
        { value: 'primary', text: 'blue' },
        { value: 'secondary', text: 'grey' },
        { value: 'success', text: 'green' },
        { value: 'danger', text: 'red' },
        { value: 'warning', text: 'yellow' },
        { value: 'info', text: 'turquoise' },
        { value: 'dark', text: 'black' },
      ],
      timers: {
        1: '',
        2: '',
        3: '',
        4: '',
      },
    },

    mutations: {
      setState(state, { name, value }) {
        state[name] = value;
      },

      setTimer(state, { input, id }) {
        state.timers[input] = id;
      },
      clearTimer(state, { input }) {
        const timerId = state.timers[input];
        clearTimeout(timerId);
      },
      writeOrderComponents(state, { programId, newOrder }) {
        state.db.programs[programId].order = [...newOrder];
      },
      addRow(state, { componentId, row }) {
        state.db.components[componentId].rows.unshift(row);
      },
      removeRows(state, { componentId, rowsId }) {
        const rows = state.db.components[componentId].rows;
        state.db.components[componentId].rows = rows.filter(
          (row) => !rowsId.includes(row.id)
        );
      },
      writeRows(state, { componentId, rows }) {
        state.db.components[componentId].rows = rows;
      },
      updateColumns(state, { componentId, columns }) {
        state.db.components[componentId].columns = JSON.parse(
          JSON.stringify(columns)
        );
      },
      addColumn(state, { componentId, columnId, newColumn, rows }) {
        state.db.components[componentId].columns[columnId] = JSON.parse(
          JSON.stringify(newColumn)
        );
        state.db.components[componentId].rows = JSON.parse(
          JSON.stringify(rows)
        );
      },
      removeColumn(state, { componentId, columnId, filteredRows }) {
        const components = { ...state.db.components };
        delete components[componentId].columns[columnId];

        components[componentId].rows = filteredRows;
        state.db.components = components;
      },
      addProgram(state, { programId, newProgram }) {
        const programs = { ...state.db.programs };
        programs[programId] = { ...newProgram };
        state.db.programs = programs;
      },
      removeProgram(state, programId) {
        const programs = { ...state.db.programs };
        delete programs[programId];
        const components = { ...state.db.components };
        for (const component in components) {
          if (components[component].programId === programId) {
            delete components[component];
          }
        }
        state.db.programs = programs;
        state.db.components = components;
      },
      updateProgram(state, program) {
        state.db.programs[program.id].programName = program.programName;
        state.db.programs[program.id].areas = program.areas;
        state.db.programs[program.id].areasOptions = program.areasOptions;
      },
      addComponent(state, { component }) {
        state.db.components[component.id] = JSON.parse(
          JSON.stringify(component)
        );
        state.db.programs[component.programId].order.push(component.id);
      },
      removeComponent(state, { program, componentId }) {
        const components = { ...state.db.components };
        delete components[componentId];
        state.db.components = components;
        state.db.programs[program.id] = { ...program };
      },
      writeResultString(state, { componentId, resultString }) {
        state.db.components[componentId].resultString = resultString;
      },
      writeParams(
        state,
        { componentId, filename, overlay, name, autoclose, uppercase }
      ) {
        state.db.components[componentId].filename = filename;
        state.db.components[componentId].overlay = overlay;
        state.db.components[componentId].name = name;
        state.db.components[componentId].autoclose = autoclose;
        state.db.components[componentId].uppercase = uppercase;
      },
      changeVmixHost(state, newHost) {
        state.vmixHost = newHost;
      },
    },

    actions: {
      saveDB: ({ state }) => {
        axios.post('/titles', { data: state.db }).then((res) => {
          return res;
        });
      },

      overlayOutAll() {
        const options = {
          url: '/api/',
          method: 'post',
          data: qs.stringify({
            Function: 'OverlayInputAllOff',
          }),
        };
        axios(options);
      },

      getVmixState: async ({ commit, state }) => {
        const { data } = await axios.get('/status');
        if (Object.keys(data).includes('error')) {
          if (state.vmixIsOnline) {
            state.vmixIsOnline = false;
          }
          state.vmixHost = data.error.vmixHost;
          return;
        }
        const { inputs, overlays, activeTitles } = data;
        commit('setState', {
          name: 'vmixState',
          value: { inputs, overlays, activeTitles },
        });
        if (!state.vmixIsOnline) {
          state.vmixIsOnline = true;
        }
      },

      getVmixStore: async ({ commit }) => {
        const data = await axios.get('/vmix-store');
        const { titles, photo } = JSON.parse(JSON.stringify(data.data));
        commit('setState', {
          name: 'vmixStore',
          value: { titles, photo },
        });
      },

      getTitles: async ({ commit }) => {
        await axios.get('/titles').then(({ data }) => {
          const titles = data.data;
          commit('setState', {
            name: 'db',
            value: titles,
          });
        });
      },

      // clearVmixInputs: ({ state }) => {
      //   let i = state.vmixState.inputs.length;
      //   while (i > 0) {
      //     const options = {
      //       url: '/api/',
      //       method: 'post',
      //       data: qs.stringify({
      //         Function: 'RemoveInput',
      //         Input: i,
      //       }),
      //     };
      //     axios(options);
      //     i--;
      //   }
      // },

      setStateMachine: ({ commit, state }) => {
        // const inputCount = state.vmixState.overlays.length;
        const inputCount = 4;
        function wait(overlayInput) {
          let timer = 15;
          return new Promise((resolve) =>
            setTimeout(
              function run(t) {
                const overlayBusy =
                  t.vmixState.overlays[overlayInput - 1] !== '';
                if (!overlayBusy) {
                  resolve();
                }
                if (timer-- < 0) {
                  resolve('TIME_OUT');
                }
                setTimeout(run, 1000, t);
              },
              1000,
              state
            )
          );
        }
        const stateMachine = new StateMachine(inputCount, run, stop, wait);
        commit('setState', {
          name: 'stateMachine',
          value: stateMachine,
        });
      },

      startStateEvent: ({ commit, dispatch }) => {
        const intervalID = setInterval(
          () => dispatch('getVmixState'),
          1000,
          dispatch
        );
        commit('setState', {
          name: 'intervalID',
          value: intervalID,
        });
      },

      stopStateEvent: ({ commit, state }) => {
        clearInterval(state.intervalID);
      },
    },
  });

export default store;
