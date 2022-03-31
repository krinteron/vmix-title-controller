<template>
  <div
    :id="component.id"
    class="duo-title"
    :style="{ 'grid-area': component.id }"
  >
    <div v-if="Object.keys(component.columns).length" class="editor">
      <BadgeComponent
        :title="component.name"
        :color="isActive ? 'success' : null"
      />
      <DropdownConfigComponent :component="component" :is-active="isActive" />
      <ColumnComponent
        v-model="left"
        class="duo-form-left"
        :component="component"
        :position="'left'"
        @save-event="show"
      />
      <ColumnComponent
        v-model="right"
        class="duo-form-right"
        :component="component"
        :position="'right'"
        @save-event="show"
      />
      <RectButton
        v-if="isActive"
        class="show-btn"
        :text="'Снять'"
        :btn-style="'danger'"
        @click="sendTitle"
      />
      <RectButton
        v-if="!isActive"
        class="show-btn"
        :text="'Вывести'"
        @click="sendTitle"
      />
    </div>
  </div>
</template>

<script>
import BadgeComponent from '../sharedComponents/BadgeComponent.vue';
import DropdownConfigComponent from '../sharedComponents/DropdownConfigComponent.vue';
import ColumnComponent from '../twoColumnsConponent/components/ColumnComponent.vue';
import RectButton from '../sharedComponents/RectButton.vue';
export default {
  components: {
    BadgeComponent,
    DropdownConfigComponent,
    ColumnComponent,
    RectButton,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      result: '',
      left: '',
      right: '',
    };
  },
  computed: {
    isActive() {
      return (
        this.$store.state.vmixState.activeTitles[this.component.filename] ===
        this.$store.state.db.components[this.component.id].resultString
      );
    },
  },
  methods: {
    show() {
      this.result = this.left + '#' + this.right;
    },

    // ____________________ОБРАБОТЧИК_ТАЙТЛОВ__________________
    sendTitle() {
      this.show();
      // if (!this.result) return;
      // const element = document.querySelector('.status-badge');
      const overlayInput = this.component.overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.$store.state.vmixState.inputs.find(
        (input) => input.title === this.component.filename
      );
      if (!currentInput) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput.number; // Находим номер инпута тайтла их списка инпутов

      if (this.isActive) {
        return this.$store.state.stateMachine[overlayInput][state](); // Если клик по активному тайтлу то закрываем его
      }
      if (!this.result.replace(/#/gi, '')) return;
      this.$store.commit('writeResultString', {
        componentId: this.component.id,
        resultString: this.result,
      });
      this.$store.dispatch('saveDB');
      this.$store.commit('clearTimer', { input: overlayInput });

      if (this.component.autoclose) {
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
        value: this.result,
      });
    },
  },
};
</script>

<style scoped>
.duo-title {
  /* max-width: 450px; */
}

.select-photo {
  padding: 2px 28px 2px 12px !important;
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
}

.editor {
  font: inherit !important;
  display: grid;
  gap: 10px 10px;
  grid-template-areas:
    'status-badge config-btn'
    'duo-form-left duo-form-right'
    /* 'display-string display-string' */
    'show-btn show-btn';
  /* grid-template-rows: 50% 50% 100%; */
  grid-template-columns: 1fr 1fr;
}

.config-btn {
  grid-area: config-btn;
  margin: 0 !important;
}

.show-btn {
  grid-area: show-btn;
}

b-form-select {
  margin: 0 !important;
}

.duo-form-left {
  display: flex;
  flex-direction: column;
  grid-area: duo-form-left;
}
.duo-form-right {
  display: flex;
  flex-direction: column;
  grid-area: duo-form-right;
}

.active {
  background: #aae28a;
}

.ending {
  background: #c29158;
}
</style>
