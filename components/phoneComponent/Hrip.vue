<template>
  <div
    :id="component.id"
    class="quad-title"
    :style="{ 'grid-area': component.id }"
  >
    <div v-if="Object.keys(component.columns).length" class="editor">
      <BadgeComponent
        :title="component.name"
        :color="isActive ? 'success' : null"
      />
      <DropdownConfigComponent :component="component" :is-active="isActive" />
      <PhoneColumnComponent
        v-model="result"
        class="hrip-form"
        :component="component"
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
import RectButton from '../sharedComponents/RectButton.vue';
import PhoneColumnComponent from './components/PhoneColumnComponent.vue';
export default {
  components: {
    BadgeComponent,
    DropdownConfigComponent,
    RectButton,
    PhoneColumnComponent,
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
      text: '#',
      photo: '',
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
      this.text = this.result.text;
      this.photo = {
        path: this.$store.state.vmixStore.photo.path + '\\',
        values: [this.result.photo],
      };
    },

    // ____________________ОБРАБОТЧИК_ТАЙТЛОВ__________________
    sendTitle() {
      // if (!this.result) return;
      // const element = document.querySelector('.status-badge');
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
      if (!this.text.replace(/#/gi, '')) return;
      this.$store.commit('writeQuadResultString', {
        componentId: this.component.id,
        resultString: this.text,
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
        value: this.text,
        photo: this.photo,
      });
    },
  },
};
</script>

<style scoped>
.quad-title {
  /* max-width: 450px; */
}

/* .display-string {
  width: 100%;
  height: 20px;
  font-family: 'Montserrat', Verdana !important;
  font-size: 10px !important;
  padding: 2px 5px;
  grid-area: display-string;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
} */

.editor {
  font: inherit !important;
  display: grid;
  gap: 10px 10px;
  grid-template-areas:
    'status-badge config-btn'
    'hrip-form hrip-form'
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

.hrip-form {
  display: flex;
  flex-direction: column;
  grid-area: hrip-form;
}

.show-btn {
  grid-area: show-btn;
}

.active {
  background: #aae28a;
}

.ending {
  background: #c29158;
}
</style>
