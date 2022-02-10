<template>
  <div v-if="Object.keys(columns).length" class="button-comp">
    <div
      v-for="buttonData in Object.values(component.columns)"
      :key="buttonData.id"
      class="button-item"
    >
      <b-dropdown
        id="dropdown-form"
        :ref="'dropdown' + buttonData.id"
        split
        :split-variant="
          (Object.keys($store.state.vmixState.activeTitles).includes(
            buttonData.filename
          ) &&
            'success') ||
          'outline-primary'
        "
        variant="outline-primary"
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
            label="Имя файла"
            label-for="config-filename"
            @submit.stop.prevent
          >
            <b-form-select
              v-if="Object.keys($store.state.vmixStore).length"
              id="config-filename"
              v-model="columns[buttonData.id].filename"
              :options="$store.state.vmixStore.titles.values"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Слой" label-for="dropdown-overlay">
            <b-form-select
              id="config-overlay"
              v-model="columns[buttonData.id].overlay"
              :options="overlays"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-checkbox
            v-model="columns[buttonData.id].autoclose"
            class="mb-3"
            >Автозакрытие</b-form-checkbox
          >
          <b-button
            variant="primary"
            size="sm"
            @click="saveConfig(buttonData.id)"
            >Сохранить</b-button
          >
        </b-dropdown-form>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
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
      overlays: [
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
      ],
    };
  },
  async beforeMount() {},
  mounted() {
    this.columns = JSON.parse(JSON.stringify(this.component.columns));
    this.componentData = { ...this.component };
  },
  methods: {
    saveConfig(id) {
      this.$refs['dropdown' + id][0].hide(true);
      this.$store.commit('updateColumns', {
        componentId: this.component.id,
        columns: this.columns,
      });
    },
    console(msg) {
      alert(msg);
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
  width: 500px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
