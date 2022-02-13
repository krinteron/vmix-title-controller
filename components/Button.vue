<template>
  <div class="button-comp">
    <b-button variant="outline-dark" class="m-2" @click="newButton">+</b-button>
    <!-- <div v-if="Object.keys(columns).length"> -->
    <div
      v-for="buttonData in Object.values(component.columns)"
      :key="buttonData.id"
      class="button-item"
    >
      <b-dropdown
        id="dropdown-form"
        :ref="'dropdown' + buttonData.id"
        split
        :split-variant="buttonData.color"
        :variant="
          (Object.keys($store.state.vmixState.activeTitles).includes(
            buttonData.filename
          ) &&
            'success') ||
          'outline-secondary'
        "
        :text="columns[buttonData.id].name"
        class="m-2"
        @click="sendTitle(buttonData)"
      >
        <b-dropdown-form class="dropdown-body">
          <b-form-group
            label="Название"
            label-for="config-header"
            @submit.stop.prevent
          >
            <b-form-input
              id="config-header"
              v-model="columns[buttonData.id].name"
              class="config-input-item-field"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Цвет"
            label-for="config-color"
            @submit.stop.prevent
          >
            <b-form-select
              id="config-color"
              v-model="columns[buttonData.id].color"
              :options="$store.state.colors"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>
          <b-form-group
            label="Имя файла"
            label-for="config-filename"
            @submit.stop.prevent
          >
            <b-form-select
              v-if="Object.keys($store.state.vmixStore).length"
              id="config-filename"
              v-model="columns[buttonData.id].filename"
              :disabled="
                Object.keys($store.state.vmixState.activeTitles).includes(
                  buttonData.filename
                )
              "
              :options="$store.state.vmixStore.titles.values"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Слой" label-for="dropdown-overlay">
            <b-form-select
              id="config-overlay"
              v-model="columns[buttonData.id].overlay"
              :disabled="
                Object.keys($store.state.vmixState.activeTitles).includes(
                  buttonData.filename
                )
              "
              :options="$store.state.vmixOverlays"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-checkbox
            v-model="columns[buttonData.id].autoclose"
            class="mb-3"
            >Автозакрытие</b-form-checkbox
          >
          <span class="config-controls-wrapper">
            <b-button
              variant="danger"
              size="sm"
              @click="deleteButton(buttonData.id)"
              >Delete</b-button
            >
            <b-button
              variant="primary"
              size="sm"
              @click="saveConfig(buttonData.id)"
              >Save</b-button
            >
          </span>
        </b-dropdown-form>
      </b-dropdown>
    </div>
    <!-- </div> -->
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
    };
  },
  beforeMount() {
    this.columns = JSON.parse(JSON.stringify(this.component.columns));
    this.componentData = { ...this.component };
  },
  mounted() {},
  methods: {
    writeColumns() {
      this.$store.commit('updateColumns', {
        componentId: this.component.id,
        columns: this.columns,
      });
    },
    saveConfig(id) {
      this.$refs['dropdown' + id][0].hide(true);
      this.writeColumns();
    },
    deleteButton(id) {
      delete this.columns[id];
      this.writeColumns();
    },
    newButton() {
      const id = uuidv4();
      this.columns[id] = {
        id,
        name: 'newButton',
        color: 'secondary',
        filename: '',
        overlay: 4,
        autoclose: false,
      };
      this.writeColumns();
    },
    sendTitle(component) {
      // if (!this.result) return;
      // const element = document.querySelector('.status-badge');
      const overlayInput = component.overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.$store.state.vmixState.inputs.filter(
        (input) => input.title === component.filename
      );
      if (!currentInput.length) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput[0].number; // Находим номер инпута тайтла их списка инпутов
      // this.sendedResult = this.result;

      if (
        Object.keys(this.$store.state.vmixState.activeTitles).includes(
          component.filename
        )
      ) {
        // element.classList.toggle('active');
        // element.classList.toggle('ending');
        return this.$store.state.stateMachine[overlayInput][state](); // Если клик по активному тайтлу то закрываем его
      }
      this.$store.commit('clearTimer', { input: overlayInput });

      if (component.autoclose) {
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
      return this.$store.state.stateMachine[overlayInput][state]({
        currentInputNumber,
        value: '',
      });
    },
  },
};
</script>

<style scoped>
.button-comp {
  display: flex;
  flex-wrap: wrap;
  /* max-width: 500px; */
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.config-controls-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
