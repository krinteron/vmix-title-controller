<template>
  <div class="button-comp" :style="{ 'grid-area': component.id }">
    <b-button variant="primary" size="sm" class="m-2" @click="newButton"
      >+</b-button
    >
    <div
      v-for="(buttonData, id) in component.columns"
      :key="id"
      class="button-item"
    >
      <ButtonItemComponent
        :button="buttonData"
        @click="sendTitle(buttonData)"
        @remove-column="removeColumn"
        @save-columns="updateColumn"
      />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import ButtonItemComponent from './components/ButtonItemComponent.vue';
export default {
  components: {
    ButtonItemComponent,
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
    this.columns = JSON.parse(JSON.stringify(this.component.columns));
  },
  mounted() {},
  methods: {
    newButton() {
      const id = uuidv4();
      const newColumn = {
        id,
        name: 'newButton',
        color: 'secondary',
        filename: '',
        overlay: 4,
        autoclose: false,
      };
      this.updateColumn(newColumn);
    },
    removeColumn(buttonId) {
      delete this.columns[buttonId];
      this.saveColumns();
    },
    updateColumn(buttonData) {
      const currentColumn = {
        [buttonData.id]: { ...buttonData },
      };
      this.columns = { ...this.columns, ...currentColumn };
      this.saveColumns();
    },
    saveColumns() {
      this.$store.commit('updateColumns', {
        componentId: this.component.id,
        columns: this.columns,
      });
      this.$store.dispatch('saveDB');
    },
    sendTitle(component) {
      const overlayInput = component.overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.$store.state.vmixState.inputs.find(
        (input) => input.title === component.filename
      );
      if (!currentInput) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput.number; // Находим номер инпута тайтла их списка инпутов

      if (
        Object.keys(this.$store.state.vmixState.activeTitles).includes(
          component.filename
        )
      ) {
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
</style>
