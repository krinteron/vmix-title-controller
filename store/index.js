import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import axios from 'axios';
import qs from 'qs';

import StateMachine from '../static/utils/StateMachine';

Vue.use(Vuex);

function run(overlayInput, { currentInputNumber, value }) {
  const textValues = value.split('#');

  const sendText = (index) => {
    if (index >= textValues.length + 1) return;
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
    return axios(options).then(() => {
      sendText(index + 1);
    });
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
      db: {},
      programs: {},
    },

    mutations: {
      setState(state, { name, value }) {
        state[name] = value;
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
        delete state.db.programs[programId];
        for (const component of Object.values(state.db.components)) {
          if (component.programId === programId) {
            delete state.db.components[component.id];
          }
        }
        axios.post('/titles', { data: state.db });
      },
      renameProgram(state, program) {
        state.db.programs[program.id].programName = program.programName;
        axios.post('/titles', { data: state.db });
      },
      addComponent(state, { id, component }) {
        state.db.components[id] = { ...component };
        axios.post('/titles', { data: state.db });
      },
      removeComponent(state, componentId) {
        delete state.db.components[componentId];
        axios.post('/titles', { data: state.db });
      },
    },

    actions: {
      getVmixState: async ({ commit }) => {
        const data = await axios.get('/status');
        const { inputs, overlays, activeTitles } = data.data;
        commit('setState', {
          name: 'vmixState',
          value: { inputs, overlays, activeTitles },
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
