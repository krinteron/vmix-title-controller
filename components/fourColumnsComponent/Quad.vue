<template>
  <div
    :id="component.id"
    :style="{ 'grid-area': component.id }"
    class="quad-title"
  >
    <div v-if="Object.keys(component.columns).length" class="editor">
      <BadgeComponent
        :title="component.name"
        :color="isActive ? 'success' : null"
      />
      <DropdownConfigComponent :component="component" :is-active="isActive" />
      <QuartComponent
        v-model="topLeft"
        class="top-left"
        :component="component"
        :position="'topLeft'"
        @save-event="show"
      />
      <QuartComponent
        v-model="topRight"
        class="top-right"
        :component="component"
        :position="'topRight'"
        @save-event="show"
      />
      <QuartComponent
        v-model="bottomLeft"
        class="bottom-left"
        :component="component"
        :position="'bottomLeft'"
        @save-event="show"
      />
      <QuartComponent
        v-model="bottomRight"
        class="bottom-right"
        :component="component"
        :position="'bottomRight'"
        @save-event="show"
      />
      <RectButton
        v-if="isActive"
        class="show-btn"
        :text="'Hide'"
        :btn-style="'danger'"
        @click="sendTitle"
      />
      <RectButton
        v-if="!isActive"
        class="show-btn"
        :text="'Show'"
        @click="sendTitle"
      />
    </div>
  </div>
</template>

<script>
import BadgeComponent from '../sharedComponents/BadgeComponent.vue';
import DropdownConfigComponent from '../sharedComponents/DropdownConfigComponent.vue';
import RectButton from '../sharedComponents/RectButton.vue';
import QuartComponent from './components/QuartColumnComponent.vue';
export default {
  components: {
    BadgeComponent,
    DropdownConfigComponent,
    QuartComponent,
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
      selectedRows: [],
      topLeft: '#',
      topRight: '#',
      bottomLeft: '#',
      bottomRight: '#',
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
      this.result =
        this.topLeft +
        '#' +
        this.topRight +
        '#' +
        this.bottomLeft +
        '#' +
        this.bottomRight;
    },

    // ____________________ОБРАБОТЧИК_ТАЙТЛОВ__________________
    sendTitle() {
      this.show();
      const overlayInput = this.component.overlay; // Находим разрешенный номер overlay для тайтла
      const state = this.$store.state.stateMachine[overlayInput].state;
      if (state === 'stopping') return;
      const currentInput = this.$store.state.vmixState.inputs.filter(
        (input) => input.title === this.component.filename
      );
      if (!currentInput.length) return; // Если в инпутах VMIX нет такого тайтла то игнорируем
      const currentInputNumber = currentInput[0].number; // Находим номер инпута тайтла их списка инпутов

      if (
        this.$store.state.vmixState.activeTitles[this.component.filename] ===
        this.$store.state.db.components[this.component.id].resultString
      ) {
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
.editor {
  font: inherit !important;
  display: grid;
  gap: 10px 10px;
  grid-template-areas:
    'status-badge config-btn'
    'top-left top-right'
    'bottom-left bottom-right'
    /* 'display-string display-string' */
    'show-btn show-btn';
  /* grid-template-rows: 50% 50% 100%; */
  grid-template-columns: 1fr 1fr;
}

.status-badge {
  grid-area: status-badge;
  line-height: 32px;
}

.config-btn {
  grid-area: config-btn;
  margin: 0 !important;
}

b-form-select {
  margin: 0 !important;
}

.show-btn {
  grid-area: show-btn;
}

.top-left {
  grid-area: top-left;
}
.top-right {
  grid-area: top-right;
  margin-bottom: 15px;
}
.bottom-left {
  grid-area: bottom-left;
}
.bottom-right {
  grid-area: bottom-right;
}

.active {
  background: #aae28a;
}

.ending {
  background: #c29158;
}
</style>
