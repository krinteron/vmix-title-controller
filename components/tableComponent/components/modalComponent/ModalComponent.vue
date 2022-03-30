<template>
  <b-modal
    :id="`modal-xl-${component.id}`"
    class="modal-config"
    size="xl"
    title="Настройки контроллера"
    @ok="saveConfig(component.id)"
  >
    <div class="config-control-btn-wrapper">
      <RectButton text="Добавить столбец" @click="addColumn(component.id)" />
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
        <RemoveButton @click-event="removeColumn(component.id, column.id)" />
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
            :options="$store.state.vmixOverlays"
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
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import RectButton from '../../../sharedComponents/RectButton.vue';
import RemoveButton from './components/RemoveButton.vue';
export default {
  components: {
    RectButton,
    RemoveButton,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columns: {},
    };
  },
  created() {
    this.configComponent();
  },
  methods: {
    configComponent() {
      this.columns = JSON.parse(JSON.stringify(this.component.columns));
    },

    saveConfig(componentId) {
      this.$store.commit('updateColumns', {
        componentId,
        columns: this.columns,
      });
      this.$store.dispatch('saveDB');
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
        uppercase: true,
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
      this.$store.dispatch('saveDB');
      this.configComponent();
    },

    removeColumn(componentId, columnId) {
      let filteredRows = this.component.rows.map((row) => {
        const value = row.value.filter((cell) => cell.columnId !== columnId);
        return {
          id: row.id,
          value,
        };
      });
      if (filteredRows.length && !filteredRows[0].value.length) {
        filteredRows = [];
      }

      this.$store.commit('removeColumn', {
        componentId,
        columnId,
        filteredRows,
      });
      this.$store.dispatch('saveDB');
      this.configComponent();
    },
  },
};
</script>

<style scoped>
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
</style>
