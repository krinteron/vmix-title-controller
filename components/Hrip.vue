<template>
  <div :id="component.id" class="quad-title">
    <div v-if="Object.keys(columns).length" class="editor">
      <b-badge
        :variant="
          ($store.state.vmixState.activeTitles[component.filename] ===
            $store.state.db.components[component.id].resultString &&
            'success') ||
          'secondary'
        "
        class="status-badge"
        >{{ component.name || 'header' }}</b-badge
      >
      <b-dropdown
        id="dropdown-form"
        ref="dropdown"
        text="Настройки"
        class="m-2 config-btn"
      >
        <b-dropdown-form class="dropdown-body">
          <b-form-group
            label="Название"
            label-for="config-header"
            @submit.stop.prevent
          >
            <b-form-input
              id="config-header"
              v-model="componentData.name"
              autocomplete="off"
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
              v-model="componentData.filename"
              :options="$store.state.vmixStore.titles.values"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Слой" label-for="dropdown-overlay">
            <b-form-select
              id="config-overlay"
              v-model="componentData.overlay"
              :options="overlays"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-checkbox v-model="componentData.autoclose" class="mb-3"
            >Автозакрытие</b-form-checkbox
          >
          <b-button variant="primary" size="sm" @click="saveConfig"
            >Сохранить</b-button
          >
        </b-dropdown-form>
      </b-dropdown>
      <div class="hrip-form">
        <div
          v-for="row in Object.values(component.columns)"
          :key="row.id"
          :class="`hrip-form${row.id}`"
        >
          <p class="input-string">
            <b-input-group class="mb-2">
              <b-input-group-prepend class="hrip-input" is-text>
                <input
                  :id="row.id"
                  type="checkbox"
                  :class="'checkbox' + row.id"
                  @click="radioHandler($event)"
                />
              </b-input-group-prepend>
              <b-form-input
                id="name"
                v-model="columns[row.id].name"
                autocomplete="off"
                :class="['hrip-input', 'hrip-input' + row.id]"
                @change="writeColumns(row.id)"
              ></b-form-input>
              <b-form-input
                id="job"
                v-model="columns[row.id].job"
                autocomplete="off"
                :class="['hrip-input', 'hrip-input' + row.id]"
                @change="writeColumns(row.id)"
              ></b-form-input>
              <b-form-select
                v-if="Object.keys($store.state.vmixStore).length"
                id="photo"
                v-model="columns[row.id].photo"
                :options="$store.state.vmixStore.photo.values"
                :class="['select-photo', 'hrip-input', 'hrip-input' + row.id]"
                @change="writeColumns(row.id)"
              ></b-form-select>
            </b-input-group>
          </p>
        </div>
      </div>
      <b-alert show variant="secondary" class="display-string">
        {{ result }}
      </b-alert>
      <b-button variant="primary" size="sm" class="show-btn" @click="sendTitle">
        Вывести/Снять
      </b-button>
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
      isActive:
        this.$store.state.vmixState.activeTitles[this.component.filename] ===
        this.result,
      result: '',
      photo: '',
      sendedResult: '',
      selectedRows: [],
      componentData: {},
      columns: {},
      topLeft: '#',
      topRight: '#',
      bottomLeft: '#',
      bottomRight: '#',
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
    saveConfig() {
      const { filename, overlay, name, autoclose } = this.componentData;
      this.$refs.dropdown.hide(true);
      this.$store.commit('writeQuadParams', {
        componentId: this.component.id,
        filename,
        overlay,
        name,
        autoclose,
      });
    },
    radioHandler(event) {
      const id = event.target.id;
      const selector = '.hrip-input' + id;
      if (event.target.checked) {
        const currentComp = document.getElementById(this.component.id);
        const allCheckBox = currentComp.querySelectorAll(
          '.editor input[type=checkbox]'
        );
        allCheckBox.forEach((elem) => (elem.checked = false));
        event.target.checked = true;
        const textNodes = [];
        currentComp.querySelectorAll(selector).forEach((elem) => {
          textNodes.push(elem.value);
        });
        this.photo = {
          path: this.$store.state.vmixStore.photo.path + '\\',
          values: [textNodes.pop()],
        };
        this.result = textNodes.join('#');
      } else {
        this.photo = {
          photos: [],
          path: '',
        };
        this.result = '#';
      }
      // this.show();
    },
    async writeColumns(id) {
      const currentComp = document.getElementById(this.component.id);
      const currentString = currentComp.querySelector('.checkbox' + id);
      const componentId = this.component.id;
      await this.$store.commit('updateColumns', {
        componentId,
        columns: this.columns,
      });
      if (currentString.checked === true) {
        const event = {
          target: currentString,
        };
        this.radioHandler(event);
      }
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
      // this.sendedResult = this.result;

      if (
        this.$store.state.vmixState.activeTitles[this.component.filename] ===
        this.$store.state.db.components[this.component.id].resultString
      ) {
        // element.classList.toggle('active');
        // element.classList.toggle('ending');
        return this.$store.state.stateMachine[overlayInput][state](); // Если клик по активному тайтлу то закрываем его
      }
      if (!this.result.replace(/#/gi, '')) return;
      this.$store.commit('writeQuadResultString', {
        componentId: this.component.id,
        resultString: this.result,
      });
      this.$store.commit('clearTimer', { input: overlayInput });

      if (this.componentData.autoclose) {
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
        photo: this.photo,
      });
    },
  },
};
</script>

<style scoped>
.quad-title {
  max-width: 500px;
}

.hrip-input {
  height: 25px !important;
}

p,
.input-string,
.input-group {
  margin: 0 !important;
}

.select-photo {
  padding: 2px 28px 2px 12px !important;
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
}

input {
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  padding: 2px 5px;
}

.display-string {
  width: 100%;
  height: 20px;
  font-family: 'Montserrat', Verdana !important;
  font-size: 10px !important;
  padding: 2px 5px;
  grid-area: display-string;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
}

.editor {
  font: inherit !important;
  display: grid;
  gap: 10px 10px;
  grid-template-areas:
    'status-badge config-btn'
    'hrip-form hrip-form'
    'display-string display-string'
    'show-btn show-btn';
  /* grid-template-rows: 50% 50% 100%; */
  grid-template-columns: 50% 50%;
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

.hrip-form {
  display: flex;
  flex-direction: column;
  grid-area: hrip-form;
}

.top-right {
  grid-area: top-right;
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
