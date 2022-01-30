<template>
  <div class="main-title">
    <table>
      <thead>
        <th>tema</th>
        <th>fio</th>
        <th>geo</th>
        <th>source</th>
        <th class="row-control">
          <div class="burger-menu">
            <div class="burger-menu-item"></div>
            <div class="burger-menu-item"></div>
            <div class="burger-menu-item"></div>
          </div>
          <ul class="submenu">
            <li @click="addRow">add row</li>
            <li @click="removeRow">delete row</li>
          </ul>
        </th>
      </thead>
    </table>
    <!-- <div class="btn-add" @click="addRow">+</div> -->
    <div class="scroll">
      <table>
        <tr v-for="row in titles" :key="row.id">
          <td v-for="title in row.value" :key="title.id">
            <input
              :id="title.id"
              readonly
              class="title-out pointer"
              :class="
                vmixState.activeTitles[types[title.type].title] ===
                  title.value && 'active'
              "
              type="text"
              autocomplete="off"
              :value="title.value"
              @select="selectText($event)"
              @blur="blur($event, title.type, title.value)"
              @contextmenu="editElem($event, title.type, title.value)"
              @dblclick="sendTitle($event, title.type, title.value)"
            />
          </td>
          <td class="row-control" @click="selectRow(row.id)">
            <div
              class="select-row"
              :class="[selectedRows.includes(row.id) && 'select-row-checked']"
            ></div>
          </td>
        </tr>
      </table>
    </div>
    {{ acc }}
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import qs from 'qs';
import StateMachine from '../static/utils/StateMachine';
export default {
  data() {
    return {
      stateMachine: '',
      titles: [],
      acc: '',
      selectedRows: [],
      intervalID: '',
      vmixState: {
        activeTitles: {},
        inputs: [],
        overlays: { length: 4 },
      },
      types: {
        tema: {
          title: 'NEWS_theme_vmix.gtzip',
          overlayInput: 1,
        },
        fio: {
          title: 'NEWS_name_vmix.gtzip',
          overlayInput: 1,
        },
        geo: {
          title: 'NEWS_geo_vmix.gtzip',
          overlayInput: 2,
        },
        source: {
          title: 'NEWS_source_vmix.gtzip',
          overlayInput: 2,
        },
      },
    };
  },
  beforeMount() {
    this.importTitles();
    this.startStateEvent();
    this.setMachine();
    // this.getCurrentStatus(this);
  },
  methods: {
    // getCurrentStatus(t) {
    //   const eventSource = new EventSource('/current-status');
    //   eventSource.addEventListener('message', function (e) {
    //     t.vmixState = JSON.parse(e.data);
    //   });
    // },
    selectRow(id) {
      if (this.selectedRows.includes(id)) {
        this.selectedRows = this.selectedRows.filter((rowId) => rowId !== id);
        return;
      }
      this.selectedRows.push(id);
    },
    removeRow() {
      if (!this.selectedRows.length) return;
      const newDB = this.titles.filter(({ id }) => {
        return !this.selectedRows.includes(id);
      });
      this.titles.length = 0;
      this.titles.push(...newDB);
      this.sendToDB();
    },
    getId() {
      return uuidv4();
    },

    async importTitles() {
      await this.$axios.get('/titles').then(({ data }) => {
        this.titles.length = 0;
        this.titles.push(...data.data);
      });
    },

    sendToDB() {
      this.$axios.post('/titles', { data: this.titles });
    },

    saveTitle({ target }) {
      const id = target.id;
      const value = target.value.toUpperCase();
      const newDB = this.titles.map((row) => {
        row.value = row.value.map((cell) => {
          if (cell.id === id) {
            cell.value = value;
          }
          return cell;
        });
        return row;
      });
      this.titles.length = 0;
      this.titles.push(...newDB);
      this.sendToDB();
    },

    // ____________________ЗАПРЕТ_ВЫДЕЛЕНИЯ_ТЕКСТА___________________
    selectText(event) {
      event.preventDefault();
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('pointer')) {
        element.selectionStart = element.selectionEnd;
      }
    },

    // ____________________STATUS_POLLING__________________
    async getVmixState() {
      await this.$axios.get('/status').then(({ data }) => {
        const { inputs, overlays, activeTitles } = data;
        this.vmixState = { inputs, overlays, activeTitles };
      });
    },

    startStateEvent() {
      this.intervalID = setInterval(this.getVmixState.bind(this), 1000);
    },

    stopStateEvent() {
      clearInterval(this.intervalID);
    },

    // ____________________ИНИЦИАЛИЗАЦИЯ_СТЕЙТ_МАШИНЫ__________________

    setMachine() {
      const inputCount = this.vmixState.overlays.length;
      this.stateMachine = new StateMachine(
        inputCount,
        this.run,
        this.stop,
        this.wait
      );
    },

    // ____________________МЕТОДЫ ДЛЯ СТЕЙТ МАШИНЫ__________________
    run(overlayInputNumber, { currentInputNumber, value }) {
      const textValues = value.split('#');

      const sendText = (index) => {
        if (index >= textValues.length) return;
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
        return this.$axios(options).then(() => {
          sendText(index + 1);
        });
      };

      return sendText(0).then(() => {
        this.$axios.post(
          '/api/',
          qs.stringify({
            Function: `OverlayInput${overlayInputNumber}`,
            Input: currentInputNumber,
          })
        );
      });
    },

    stop(input) {
      return this.$axios.post(
        '/api/',
        qs.stringify({
          Function: `OverlayInput${input}Out`,
        })
      );
    },

    wait(input) {
      let timer = 15;
      return new Promise((resolve) =>
        setTimeout(
          function run(t) {
            const overlayBusy = t.vmixState.overlays[input - 1] !== '';
            if (!overlayBusy) {
              resolve();
            }
            if (timer-- < 0) {
              resolve('TIME_OUT');
            }
            setTimeout(run, 1000, t);
          },
          1000,
          this
        )
      );
    },

    // ____________________ОБРАБОТЧИК ТАЙТЛОВ__________________
    sendTitle(event, type, value) {
      if (!value) return;
      const id = event.target.id;
      const element = document.getElementById(id);
      if (!element.classList.contains('pointer')) return; // Если ячейка редактируется то игнорируем
      const overlayInput = this.types[type].overlayInput; // Находим разрешенный номер overlay для тайтла
      const state = this.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.vmixState.inputs.filter(
        (input) => input.title === this.types[type].title
      );
      if (!currentInput.length) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput[0].number; // Находим номер инпута тайтла их списка инпутов
      if (element.classList.contains('active')) {
        element.classList.toggle('active');
        element.classList.toggle('ending');
        return this.stateMachine[overlayInput][state](); // Если клик по активному тайтлу то закрываем его
      }
      element.classList.toggle('starting');
      return this.stateMachine[overlayInput][state]({
        currentInputNumber,
        value,
      });
    },

    blur(event, type, value) {
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('pointer')) return;
      this.editElem(event, type, value);
    },

    editElem(event) {
      event.preventDefault();
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('active')) return;
      element.toggleAttribute('readonly');
      element.classList.toggle('pointer');
      element.classList.toggle('editable');
      if (element.classList.contains('editable')) {
        this.stopStateEvent();
      } else {
        this.saveTitle(event);
        this.startStateEvent();
      }
    },
    addRow() {
      const newRow = () => ({
        id: uuidv4(),
        value: [
          {
            type: 'tema',
            isActive: false,
            id: uuidv4(),
            value: '',
          },
          {
            type: 'fio',
            isActive: false,
            id: uuidv4(),
            value: '',
          },
          {
            type: 'geo',
            isActive: false,
            id: uuidv4(),
            value: '',
          },
          {
            type: 'source',
            isActive: false,
            id: uuidv4(),
            value: '',
          },
        ],
      });
      this.titles.unshift(newRow(), newRow());
    },
  },
};
</script>

<style scoped>
.main-title {
  width: 800px;
  height: 600px;
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px;
}

table {
  border: 1px solid rgb(128, 126, 126);
  text-align: center;
  width: 100%;
}

td {
  border: 1px solid rgb(128, 126, 126);
  height: 25px !important;
  width: 200px;
}

th {
  border: 1px solid rgb(128, 126, 126);
  background: #02a0da;
  color: white;
  width: 200px;
  height: 25px;
}

.scroll {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.pointer {
  cursor: pointer;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.editable {
  background: #cbd7b5;
  font-style: italic;
}

.row-control {
  position: relative;
  width: 40px;
  cursor: pointer;
}

input {
  border: none;
  width: 100%;
  height: 100%;
  outline: none;
  text-align: center;
  font-weight: 500;
  text-transform: uppercase;
}

input.pointer:hover {
  background: #97cded;
  transition: 0.2s;
}

.active {
  background: #c25858;
}
.ending {
  background: #c29158;
}
.starting {
  background: #aae28a;
  animation: blinker 0.4s ease-in infinite;
  -webkit-animation: blinker 0.4s ease-in infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.7;
  }
}

.burger-menu {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.burger-menu-item {
  background: white;
  width: 25px;
  height: 3px;
}

.submenu {
  opacity: 0;
  position: absolute;
  width: 150px;
  right: 0;
  top: 41px;
  font-weight: normal;
  z-index: 2;
  transform: scaleY(0);
  transform-origin: 0 0;
  transition: 0.15s;
}

.row-control:hover .submenu {
  opacity: 1;
  transform: scaleY(1);
}

.submenu li,
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.submenu li {
  background: #48c5f3;
  height: 40px;
  text-align: center;
  line-height: 40px;
  user-select: none;
}

.submenu li:hover {
  background: #45a3c5;
}

.submenu li:active {
  background: #357d97;
}

.select-row {
  width: 15px;
  height: 15px;
  border: 2px solid rgb(165, 165, 165);
  margin: auto;
}

.select-row-checked {
  background: #48f3ba;
}

/* _____________________________ */

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.7);
}
</style>

//
<table>
//         <tr v-for="card in data" :key="card.type">
//           <td>
//             <input
//               :id="getId()"
//               readonly
//               class="title-out pointer"
//               type="text"
//               :value="card.tema"
//               @select="selectText($event)"
//               @blur="blur($event, 'tema', card.tema)"
//               @contextmenu="editElem($event, 'tema', card.tema)"
//               @dblclick="sendTitle($event, 'tema', card.tema)"
//             />
//           </td>
//           <td>
//             <input
//               :id="getId()"
//               readonly
//               class="title-out pointer"
//               type="text"
//               :value="card.fio"
//               @select="selectText($event)"
//               @blur="blur($event, 'fio', card.fio)"
//               @contextmenu="editElem($event, 'fio', card.fio)"
//               @dblclick="sendTitle($event, 'fio', card.fio)"
//             />
//           </td>
//           <td>
//             <input
//               :id="getId()"
//               readonly
//               class="title-out pointer"
//               type="text"
//               :value="card.geo"
//               @select="selectText($event)"
//               @blur="blur($event, 'geo', card.geo)"
//               @contextmenu="editElem($event, 'geo', card.geo)"
//               @dblclick="sendTitle($event, 'geo', card.geo)"
//             />
//           </td>
//           <td>
//             <input
//               :id="getId()"
//               readonly
//               class="title-out pointer"
//               type="text"
//               :value="card.source"
//               @select="selectText($event)"
//               @blur="blur($event, 'source', card.source)"
//               @contextmenu="editElem($event, 'source', card.source)"
//               @dblclick="sendTitle($event, 'source', card.source)"
//             />
//           </td>
//         </tr>
//       </table>

// data: [ // { // tema: 'самолет', // fio: 'Иван Иванов', // geo: 'Москва', //
source: 'Газета', // }, // { // tema: 'рукопись', // fio: 'Иван Пакетин', //
geo: 'Рязань', // source: 'источник', // }, // { // tema: 'вагон', // fio: 'Иван
Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // { // tema: '', // fio:
'', // geo: '', // source: 'Газета', // }, // { // tema: '', // fio: '', // geo:
'', // source: '', // }, // { // tema: 'вагон', // fio: 'Иван Сусанин', // geo:
'Казань', // source: 'Медуза', // }, // { // tema: 'самолет', // fio: 'Иван
Иванов', // geo: 'Москва', // source: 'Газета', // }, // { // tema: 'рукопись',
// fio: 'Иван Пакетин', // geo: 'Рязань', // source: 'источник', // }, // { //
tema: 'вагон', // fio: 'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', //
}, // { // tema: '', // fio: '', // geo: '', // source: 'Газета', // }, // { //
tema: '', // fio: '', // geo: '', // source: '', // }, // { // tema: 'вагон', //
fio: 'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // { // tema:
'самолет', // fio: 'Иван Иванов', // geo: 'Москва', // source: 'Газета', // },
// { // tema: 'рукопись', // fio: 'Иван Пакетин', // geo: 'Рязань', // source:
'источник', // }, // { // tema: 'вагон', // fio: 'Иван Сусанин', // geo:
'Казань', // source: 'Медуза', // }, // { // tema: '', // fio: '', // geo: '',
// source: 'Газета', // }, // { // tema: '', // fio: '', // geo: '', // source:
'', // }, // { // tema: 'вагон', // fio: 'Иван Сусанин', // geo: 'Казань', //
source: 'Медуза', // }, // { // tema: 'самолет', // fio: 'Иван Иванов', // geo:
'Москва', // source: 'Газета', // }, // { // tema: 'рукопись', // fio: 'Иван
Пакетин', // geo: 'Рязань', // source: 'источник', // }, // { // tema: 'вагон',
// fio: 'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // { //
tema: '', // fio: '', // geo: '', // source: 'Газета', // }, // { // tema: '',
// fio: '', // geo: '', // source: '', // }, // { // tema: 'вагон', // fio:
'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // { // tema:
'самолет', // fio: 'Иван Иванов', // geo: 'Москва', // source: 'Газета', // },
// { // tema: 'рукопись', // fio: 'Иван Пакетин', // geo: 'Рязань', // source:
'источник', // }, // { // tema: 'вагон', // fio: 'Иван Сусанин', // geo:
'Казань', // source: 'Медуза', // }, // { // tema: '', // fio: '', // geo: '',
// source: 'Газета', // }, // { // tema: '', // fio: '', // geo: '', // source:
'', // }, // { // tema: 'вагон', // fio: 'Иван Сусанин', // geo: 'Казань', //
source: 'Медуза', // }, // { // tema: 'самолет', // fio: 'Иван Иванов', // geo:
'Москва', // source: 'Газета', // }, // { // tema: 'рукопись', // fio: 'Иван
Пакетин', // geo: 'Рязань', // source: 'источник', // }, // { // tema: 'вагон',
// fio: 'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // { //
tema: '', // fio: '', // geo: '', // source: 'Газета', // }, // { // tema: '',
// fio: '', // geo: '', // source: '', // }, // { // tema: 'вагон', // fio:
'Иван Сусанин', // geo: 'Казань', // source: 'Медуза', // }, // ],
