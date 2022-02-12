<template>
  <div class="main-title">
    <div class="scroll">
      <table>
        <thead>
          <th
            v-for="column in Object.values(component.columns)"
            :key="column.name"
          >
            {{ column.name }}
          </th>
          <th class="row-control">
            <div class="burger-menu">
              <div class="burger-menu-item"></div>
              <div class="burger-menu-item"></div>
              <div class="burger-menu-item"></div>
            </div>
            <ul class="submenu">
              <span v-if="Object.keys(component.columns).length">
                <li @click="addRow">add row</li>
                <li @click="removeRow">delete row</li>
              </span>
              <li
                v-b-modal:[`modal-xl-${component.id}`]
                @click="configComponent(component)"
              >
                settings
              </li>
            </ul>
          </th>
        </thead>
        <tr v-for="row in component.rows" :key="row.id">
          <td v-for="cell in row.value" :key="cell.id">
            <input
              :id="cell.id"
              readonly
              class="title-out pointer"
              :class="
                $store.state.vmixState.activeTitles[
                  component.columns[cell.columnId].filename
                ] === cell.value && 'active'
              "
              type="text"
              autocomplete="off"
              :value="cell.value"
              @keyup="validate($event, cell.columnId)"
              @select="selectText($event)"
              @blur="blur($event, cell)"
              @contextmenu="editElem($event, cell)"
              @dblclick="sendTitle($event, cell)"
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
    <b-modal
      :id="`modal-xl-${component.id}`"
      size="xl"
      title="Настройки контроллера"
      @ok="saveConfig(component.id)"
    >
      <div class="config-control-btn-wrapper">
        <b-button
          size="sm"
          class="config-input-add-btn"
          variant="primary"
          href="#"
          @click="addColumn(component.id)"
          >Добавить столбец</b-button
        >
        <b-button
          size="sm"
          class="config-input-add-btn"
          variant="danger"
          href="#"
          @click="removeComponent(component.id)"
          >Удалить контроллер</b-button
        >
      </div>
      <transition-group
        v-if="Object.keys(columns).length"
        tag="span"
        name="card"
        class="modal-flex-container"
      >
        <div
          v-for="column in Object.values(component.columns)"
          :key="column.id"
          class="config-input-form"
        >
          <div class="config-remove-btn-wrapper">
            <div
              class="config-remove-btn"
              @click="removeColumn(component.id, column.id)"
            >
              <div class="cros-line-1"></div>
              <div class="cros-line-2"></div>
            </div>
          </div>

          <p class="config-input-item">
            <label for="config-header">Заголовок</label>
            <b-form-input
              id="config-header input-small"
              v-model="columns[column.id].name"
              class="config-input-item-field"
            ></b-form-input>
          </p>
          <p class="config-input-item">
            <label for="config-filename">Имя файла</label>
            <b-form-select
              v-if="Object.keys($store.state.vmixStore).length"
              id="config-filename"
              v-model="columns[column.id].filename"
              :options="$store.state.vmixStore.titles.values"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </p>
          <p class="config-input-item">
            <label for="config-overlay">Слой</label>
            <b-form-select
              id="config-overlay"
              v-model="columns[column.id].overlay"
              :options="options"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </p>
          <p class="config-input-item">
            <label for="config-autoclose">Автозакрытие</label>
            <input
              id="config-autoclose"
              v-model="columns[column.id].autoclose"
              class="config-input-item-field checkbox"
              type="checkbox"
            />
            <label for="config-uppercase">Регистр</label>
            <input
              id="config-uppercase"
              v-model="columns[column.id].uppercase"
              class="config-input-item-field checkbox"
              type="checkbox"
            />
          </p>
        </div>
      </transition-group>
    </b-modal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedRows: [],
      columns: {},
      options: [
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
      ],
    };
  },
  async beforeMount() {},
  mounted() {},
  methods: {
    // ____________________ВЫБОР_СТРОК___________________

    selectRow(id) {
      if (this.selectedRows.includes(id)) {
        this.selectedRows = this.selectedRows.filter((rowId) => rowId !== id);
        return;
      }
      this.selectedRows.push(id);
    },

    // ____________________ДОБАВЛЕНИЕ_СТРОК___________________

    addRow() {
      const row = {
        id: uuidv4(),
        value: [],
      };
      for (const columnId of Object.keys(this.component.columns)) {
        row.value.push({
          id: uuidv4(),
          columnId,
          value: '',
        });
      }
      const newRow = {
        componentId: this.component.id,
        row,
      };
      this.$store.commit('addRow', newRow);
      // await this.$store.dispatch('getTitles');
    },

    // ____________________УДАЛЕНИЕ_СТРОК___________________

    removeRow() {
      if (!this.selectedRows.length) return;
      const removedRows = {
        componentId: this.component.id,
        rowsId: this.selectedRows,
      };
      this.$store.commit('removeRows', removedRows);
    },

    configComponent() {
      this.columns = JSON.parse(JSON.stringify(this.component.columns));
    },

    saveConfig(componentId) {
      this.$store.commit('updateColumns', {
        componentId,
        columns: this.columns,
      });
    },

    removeComponent(componentId) {
      this.$store.commit('removeComponent', componentId);
      this.$store.dispatch('getTitles');
    },

    addColumn(componentId) {
      const columnId = uuidv4();
      const columnsCount = Object.keys(this.component.columns).length;
      if (columnsCount >= 5) return;

      const newColumn = {
        id: columnId,
        name: `ЗАГОЛОВОК${columnsCount + 1}`,
        filename: '',
        autoclose: false,
        uppercase: false,
        overlay: 1,
      };
      let rows = [];
      if (this.component.rows.length) {
        rows = JSON.parse(JSON.stringify(this.component.rows));
        rows.forEach((row) => {
          return row.value.push({
            id: uuidv4(),
            columnId,
            value: '',
          });
        });
      }

      this.$store.commit('addColumn', {
        componentId,
        columnId,
        newColumn,
        rows,
      });
      this.configComponent();
    },

    removeColumn(componentId, columnId) {
      const filteredRows = this.component.rows.map((row) => {
        const value = row.value.filter((cell) => cell.columnId !== columnId);
        return {
          id: row.id,
          value,
        };
      });

      this.$store.commit('removeColumn', {
        componentId,
        columnId,
        filteredRows,
      });
      this.configComponent();
    },

    // ____________________СОХРАНЕНИЕ_ЯЧЕЙКИ___________________

    writeRows({ target }, { columnId }) {
      const id = target.id;
      const value = target.value;
      // if (this.component.columns[columnId].uppercase) {
      //   value = value.toUpperCase();
      // }
      const rows = this.component.rows.map((row) => {
        row.value = row.value.map((cell) => {
          if (cell.id === id) {
            cell.value = value;
          }
          return cell;
        });
        return row;
      });
      const newRow = {
        componentId: this.component.id,
        rows,
      };
      this.$store.commit('writeRows', newRow);
    },

    // ____________________СОХРАНЕНИЕ_ПРИ_ПОТЕРЕ_ФОКУСА___________________

    blur(event, cell) {
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('pointer')) return;
      this.editElem(event, cell);
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

    validate(event, columnId) {
      const id = event.target.id;
      const element = document.getElementById(id);
      const uppercase = this.component.columns[columnId].uppercase;
      if (uppercase) {
        element.value = element.value.toUpperCase();
      }
    },

    // ____________________РЕДАКТИРОВАНИЕ_ТЕКСТА___________________

    editElem(event, cell) {
      event.preventDefault();
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('active')) return;
      element.toggleAttribute('readonly');
      element.classList.toggle('pointer');
      element.classList.toggle('editable');
      if (element.classList.contains('editable')) {
        this.$store.dispatch('stopStateEvent');
      } else {
        this.writeRows(event, cell);
        this.$store.dispatch('startStateEvent');
      }
    },

    // ____________________ОБРАБОТЧИК_ТАЙТЛОВ__________________
    sendTitle(event, cell) {
      if (!cell.value) return;
      const id = event.target.id;
      const element = document.getElementById(id);
      if (!element.classList.contains('pointer')) return; // Если ячейка редактируется то игнорируем
      const overlayInput = this.component.columns[cell.columnId].overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.$store.state.vmixState.inputs.filter(
        (input) =>
          input.title === this.component.columns[cell.columnId].filename
      );
      if (!currentInput.length) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput[0].number; // Находим номер инпута тайтла их списка инпутов
      if (element.classList.contains('active')) {
        element.classList.toggle('active');
        element.classList.toggle('ending');
        return this.$store.state.stateMachine[overlayInput][state](); // Если клик по активному тайтлу то закрываем его
      }
      this.$store.commit('clearTimer', { input: overlayInput });

      if (this.component.columns[cell.columnId].autoclose) {
        const timerId = setTimeout(
          (overlayInput) => {
            this.$store.state.stateMachine[overlayInput].running();
          },
          10000,
          overlayInput
        );
        const timerData = {
          input: overlayInput,
          id: timerId,
        };
        this.$store.commit('setTimer', timerData);
      }

      element.classList.toggle('starting');
      return this.$store.state.stateMachine[overlayInput][state]({
        currentInputNumber,
        value: cell.value,
      });
    },
  },
};
</script>

<style scoped>
.main-title {
  min-width: 500px;
  max-width: 700px;

  font-family: 'Montserrat', Verdana !important;
  font-size: 12px;
  /* margin: 10px; */
}

.config-control-btn-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-flex-container {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.modal-flex-container div {
  transition: all 0.3s;
}

.card-enter {
  opacity: 0;
}
.card-enter-to {
  opacity: 1;
  transition: opacity 0.5s;
}

.card-leave-to {
  opacity: 0;
  transition: opacity 0.5s;
}

.config-input-form {
  position: relative;
  width: 45%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
}

.config-input-item {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
}

.config-input-item-field {
  width: 70%;
  font-size: 12px;
  border: 1px solid #ced4da;
  margin: 0 !important;
  padding: 4px 28px 4px 8px;
}

.config-input-item .checkbox {
  height: 20px;
}

.config-remove-btn-wrapper {
  text-align: right;
}

.config-remove-btn {
  position: relative;
  display: inline-block;
  height: 20px;
}

.config-remove-btn:hover div {
  background: #d00;
  transition: 0.2s;
}

.cros-line-1 {
  position: relative;
  width: 20px;
  height: 6px;
  top: 30%;
  background: rgb(214, 212, 212);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.cros-line-2 {
  position: relative;
  width: 20px;
  height: 6px;
  background: rgb(214, 212, 212);
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.scroll {
  height: 100%;
  min-height: 200px;
  max-height: 60vh;
  width: 100%;
  overflow-x: hidden;
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
  /* background: #02a0da; */
  background-color: #007bff;
  color: white;
  width: 200px;
  height: 35px;
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
  background: #90c8df;
  font-style: italic;
}

.row-control {
  position: relative;
  width: 30px;
  cursor: pointer;
}

.title-out {
  border: none;
  width: 100%;
  height: 100%;
  outline: none;
  text-align: center;
  font-weight: 500;
  /* text-transform: uppercase; */
}

input.pointer:hover {
  background: #97cded;
  transition: 0.2s;
}

.active {
  background: #aae28a;
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
  width: 15px;
  height: 2px;
}

.submenu {
  opacity: 0;
  position: absolute;
  width: 150px;
  right: 0;
  top: 26px;
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
  height: 30px;
  text-align: center;
  line-height: 30px;
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
