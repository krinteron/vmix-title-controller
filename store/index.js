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
      errors: [],
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

    getters: {
      haveErrors(state) {
        return !!state.errors.length;
      },
      getErrors(state) {
        return state.errors;
      },
      getVmixHost(state) {
        return state.vmixHost;
      },
      getVmixState(state) {
        return state.vmixState;
      },
    },

    mutations: {
      setError(state, error) {
        state.errors.push(error);
      },

      setVmixHost(state, host) {
        state.vmixHost = host;
      },

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
    },

    actions: {
      launch: async ({ dispatch, getters }) => {
        await dispatch('getVmixState');
        await dispatch('getTitles');
        await dispatch('getVmixStore');
        if (!getters.haveErrors) {
          dispatch('startStateEvent');
          dispatch('setStateMachine');
        }
      },

      saveDB: ({ state }) => {
        axios.post('/titles', { data: state.db }).then((res) => {
          return res;
        });
      },

      setVmixHost({ commit }, host) {
        commit('setVmixHost', host);
      },

      async sendVmixHost({ getters }) {
        const host = getters.getVmixHost;
        await axios.post('/vmix-host', { data: host });
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

      getVmixState: ({ commit, dispatch }) => {
        axios
          .get('/status')
          .then(({ data }) => {
            const { inputs, overlays, activeTitles } = data;
            commit('setState', {
              name: 'vmixState',
              value: { inputs, overlays, activeTitles },
            });
          })
          .catch((err) => {
            dispatch('stopStateEvent');
            const { message, payload } = err.response.data.error;
            dispatch('setVmixHost', payload);
            commit('setError', {
              title: 'VMIX',
              message,
              payload,
            });
          });
      },

      getVmixStore: ({ commit }) => {
        return axios
          .get('/vmix-store')
          .then((response) => {
            const { titles, photo } = response.data;
            commit('setState', {
              name: 'vmixStore',
              value: { titles, photo },
            });
          })
          .catch((err) => {
            const { message } = err.response.data.error;
            commit('setError', {
              title: 'SMB',
              message,
            });
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

      setStateMachine: ({ commit, getters }) => {
        // const inputCount = state.vmixState.overlays.length;
        const inputCount = 4;
        function wait(overlayInput) {
          let timer = 15;
          return new Promise((resolve) =>
            setTimeout(
              function run(vmixState) {
                const overlayBusy =
                  vmixState().overlays[overlayInput - 1] !== '';
                if (!overlayBusy) {
                  resolve();
                }
                if (timer-- < 0) {
                  resolve('TIME_OUT');
                }
                setTimeout(run, 1000, vmixState);
              },
              1000,
              () => getters.getVmixState
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
