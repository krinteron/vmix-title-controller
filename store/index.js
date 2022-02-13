import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import axios from 'axios';
import qs from 'qs';

import StateMachine from '../static/utils/StateMachine';

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

  return (
    sendText(0)
      // .then(() => sendPhoto(0))
      .then(() => {
        axios.post(
          '/api/',
          qs.stringify({
            Function: `OverlayInput${overlayInput}`,
            Input: currentInputNumber,
          })
        );
      })
  );
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
      writeOrderComponents(state, { programId, newOrder }) {
        state.db.programs[programId].order = [...newOrder];
        axios.post('/titles', { data: state.db });
      },
      addRow(state, { componentId, row }) {
        state.db.components[componentId].rows.unshift(row);
        axios.post('/titles', { data: state.db });
      },
      removeRows(state, { componentId, rowsId }) {
        const rows = state.db.components[componentId].rows;
        state.db.components[componentId].rows = rows.filter(
          (row) => !rowsId.includes(row.id)
        );
        axios.post('/titles', { data: state.db });
      },
      writeRows(state, { componentId, rows }) {
        state.db.components[componentId].rows = rows;
        axios.post('/titles', { data: state.db });
      },
      updateColumns(state, { componentId, columns }) {
        state.db.components[componentId].columns = JSON.parse(
          JSON.stringify(columns)
        );
        axios.post('/titles', { data: state.db });
      },
      addColumn(state, { componentId, columnId, newColumn, rows }) {
        state.db.components[componentId].columns[columnId] = JSON.parse(
          JSON.stringify(newColumn)
        );
        state.db.components[componentId].rows = JSON.parse(
          JSON.stringify(rows)
        );
        axios.post('/titles', { data: state.db });
      },
      removeColumn(state, { componentId, columnId, filteredRows }) {
        delete state.db.components[componentId].columns[columnId];
        state.db.components[componentId].rows = JSON.parse(
          JSON.stringify(filteredRows)
        );

        axios.post('/titles', { data: state.db });
      },
      addProgram(state, { programId, newProgram }) {
        state.db.programs[programId] = { ...newProgram };
        axios.post('/titles', { data: state.db });
      },
      removeProgram(state, programId) {
        for (const component of Object.values(state.db.components)) {
          if (component.programId === programId) {
            delete state.db.components[component.id];
          }
        }
        delete state.db.programs[programId];
        axios.post('/titles', { data: state.db });
      },
      renameProgram(state, program) {
        state.db.programs[program.id].programName = program.programName;
        axios.post('/titles', { data: state.db });
      },
      addComponent(state, { id, component }) {
        state.db.components[id] = { ...component };
        // state.db.programs[component.programId].order.push(component.id);
        axios.post('/titles', { data: state.db });
      },
      removeComponent(state, componentId) {
        delete state.db.components[componentId];
        axios.post('/titles', { data: state.db });
      },
      writeQuadResultString(state, { componentId, resultString }) {
        state.db.components[componentId].resultString = resultString;
        axios.post('/titles', { data: state.db });
      },
      writeQuadParams(
        state,
        { componentId, filename, overlay, name, autoclose }
      ) {
        state.db.components[componentId].filename = filename;
        state.db.components[componentId].overlay = overlay;
        state.db.components[componentId].name = name;
        state.db.components[componentId].autoclose = autoclose;
        axios.post('/titles', { data: state.db });
      },
      changeVmixHost(state, newHost) {
        state.vmixHost = newHost;
        axios.post('/vmix-host', { data: newHost });
      },
    },

    actions: {
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
