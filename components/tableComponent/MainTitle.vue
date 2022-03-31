<template>
  <b-table-simple
    class="main"
    sticky-header
    :style="{ 'grid-area': component.id }"
  >
    <b-thead head-variant="dark">
      <b-tr>
        <b-th v-for="(value, id) in component.columns" :key="id">
          {{ value.name }}
        </b-th>
        <b-th class="row-controll">
          <DropdownMenuComponent
            :component-id="component.id"
            :have-columns="!!Object.keys(component.columns).length"
            @add-row-event="addRow"
            @remove-row-event="removeRow"
          />
        </b-th>
      </b-tr>
    </b-thead>
    <b-tbody>
      <b-tr v-for="row in component.rows" :key="row.id">
        <b-td v-for="cell in row.value" :key="cell.id">
          <InputComponent
            :class="isActive(cell)"
            :cell="cell"
            :uppercase="component.columns[cell.columnId].uppercase"
            @dblclick-event="sendTitle($event, cell)"
            @save-event="writeRows($event)"
          />
        </b-td>
        <b-td class="row-control" @click="selectRow(row.id)">
          <div
            class="select-row"
            :class="[selectedRows.includes(row.id) && 'select-row-checked']"
          ></div>
        </b-td>
      </b-tr>
    </b-tbody>
    <ModalComponent :component="component" />
  </b-table-simple>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import InputComponent from './components/InputComponent.vue';
import DropdownMenuComponent from './components/DropdownMenuComponent.vue';
import ModalComponent from './components/modalComponent/ModalComponent.vue';
export default {
  components: {
    InputComponent,
    DropdownMenuComponent,
    ModalComponent,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedRows: [],
    };
  },
  methods: {
    isActive(cell) {
      return (
        this.$store.state.vmixState.activeTitles[
          this.component.columns[cell.columnId].filename
        ] === cell.value && 'active'
      );
    },

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
      this.$store.dispatch('saveDB');
    },

    // ____________________УДАЛЕНИЕ_СТРОК___________________

    removeRow() {
      if (!this.selectedRows.length) return;
      const removedRows = {
        componentId: this.component.id,
        rowsId: this.selectedRows,
      };
      this.$store.commit('removeRows', removedRows);
      this.$store.dispatch('saveDB');
    },

    // ____________________СОХРАНЕНИЕ_ЯЧЕЙКИ___________________
    writeRows({ target }) {
      const id = target.id;
      const value = target.value;
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
      this.$store.dispatch('saveDB');
    },

    // ____________________ОБРАБОТЧИК_ТАЙТЛОВ__________________
    sendTitle(event, cell) {
      const { target } = event;
      if (!cell.value) return; // Если ячейка пустая то игнорируем
      if (!target.classList.contains('pointer')) return; // Если ячейка редактируется то игнорируем

      const overlayInput = this.component.columns[cell.columnId].overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;

      const currentInput = this.$store.state.vmixState.inputs.find(
        (input) =>
          input.title === this.component.columns[cell.columnId].filename
      );
      if (!currentInput) return; // Если в инпутах VMIX нет такого тайтла то игнорируем

      const currentInputNumber = currentInput.number; // Находим номер инпута тайтла их списка инпутов
      if (target.classList.contains('active')) {
        target.classList.toggle('active');
        target.classList.toggle('ending');
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

      let text = cell.value;

      const titleTextCount = currentInput.text.split('#').length;
      const valueTextCount = cell.value.split('#').length;
      // Добавляем # для перезаписи всех текстовых блоков в тайтле
      if (valueTextCount < titleTextCount) {
        text = cell.value + '#'.repeat(titleTextCount - valueTextCount);
        target.value = text;
        this.writeRows(event, cell);
      }

      target.classList.toggle('starting');
      return this.$store.state.stateMachine[overlayInput][state]({
        currentInputNumber,
        value: text,
      });
    },
  },
};
</script>

<style scoped>
.main {
  display: block;
  min-height: 200px;
  min-width: 100px;
}

.b-table-sticky-header {
  max-height: 100%;
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px;
}

.table td {
  padding: 0;
}

table {
  border: 1px solid rgb(128, 126, 126);
  text-align: center;
  width: 100%;
}

td {
  border: 1px solid rgb(128, 126, 126);
  height: 30px !important;
  width: 200px;
}

th {
  border: 1px solid rgb(128, 126, 126);
  /* background: #02a0da; */
  text-align: center;
  background-color: #6c757d !important;
  padding: 0.6rem;
  color: white;
  width: 200px;
  height: 34px;
}

.editable {
  background: #90c8df;
  font-style: italic;
}

.row-controll {
  padding: 4px;
  width: 25px;
}

.row-control {
  position: relative;
  width: 30px;
  cursor: pointer;
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

.select-row {
  height: 100%;
  border: 1px solid rgb(165, 165, 165);
  margin: auto;
}

.select-row-checked {
  background: #48f3ba;
}
</style>
