<template>
  <div
    :id="component.id"
    class="duo-title"
    :style="{ 'grid-area': component.id }"
  >
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
              :disabled="
                $store.state.vmixState.activeTitles[component.filename] ===
                $store.state.db.components[component.id].resultString
              "
              :options="$store.state.vmixStore.titles.values"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Слой" label-for="dropdown-overlay">
            <b-form-select
              id="config-overlay"
              v-model="componentData.overlay"
              :disabled="
                $store.state.vmixState.activeTitles[component.filename] ===
                $store.state.db.components[component.id].resultString
              "
              :options="$store.state.vmixOverlays"
              size="sm"
              class="mt-3 config-input-item-field"
            ></b-form-select>
          </b-form-group>

          <b-form-checkbox v-model="componentData.autoclose" class="mb-3"
            >Автозакрытие</b-form-checkbox
          >
          <b-form-checkbox v-model="componentData.uppercase" class="mb-3"
            >Регистр</b-form-checkbox
          >
          <b-button variant="primary" size="sm" @click="saveConfig"
            >Сохранить</b-button
          >
        </b-dropdown-form>
      </b-dropdown>
      <div class="duo-form-left">
        <div
          v-for="row in Object.values(component.columns).filter(
            ({ position }) => position === 'left'
          )"
          :key="row.id"
          :class="`duo-form${row.id}`"
        >
          <p class="input-string">
            <b-input-group class="mb-2">
              <b-input-group-prepend class="duo-input" is-text>
                <!-- <b-form-checkbox
                  :id="row.id"
                  size="lg"
                  type="checkbox"
                  :class="'checkbox' + row.id"
                  @click="radioHandler($event, 'left')"
                ></b-form-checkbox> -->
                <input
                  :id="row.id"
                  type="checkbox"
                  :class="'checkbox' + row.id"
                  @click="radioHandler($event, 'left')"
                />
              </b-input-group-prepend>
              <b-form-input
                id="name"
                v-model="columns[row.id].name"
                autocomplete="off"
                :class="['duo-input', 'duo-input' + row.id]"
                @keyup="validate($event)"
                @change="writeColumns(row.id, 'left')"
              ></b-form-input>
              <!-- <b-form-input
                id="job"
                v-model="columns[row.id].job"
                autocomplete="off"
                :class="['duo-input', 'duo-input' + row.id]"
                @keyup="validate($event)"
                @change="writeColumns(row.id)"
              ></b-form-input> -->
            </b-input-group>
          </p>
        </div>
      </div>
      <div class="duo-form-right">
        <div
          v-for="row in Object.values(component.columns).filter(
            ({ position }) => position === 'right'
          )"
          :key="row.id"
          :class="`duo-form${row.id}`"
        >
          <p class="input-string">
            <b-input-group class="mb-2">
              <b-input-group-prepend class="duo-input" is-text>
                <input
                  :id="row.id"
                  type="checkbox"
                  :class="'checkbox' + row.id"
                  @click="radioHandler($event, 'right')"
                />
              </b-input-group-prepend>
              <b-form-input
                id="name"
                v-model="columns[row.id].name"
                autocomplete="off"
                :class="['duo-input', 'duo-input' + row.id]"
                @keyup="validate($event)"
                @change="writeColumns(row.id, 'right')"
              ></b-form-input>
              <!-- <b-form-input
                id="job"
                v-model="columns[row.id].job"
                autocomplete="off"
                :class="['duo-input', 'duo-input' + row.id]"
                @keyup="validate($event)"
                @change="writeColumns(row.id)"
              ></b-form-input> -->
            </b-input-group>
          </p>
        </div>
      </div>
      <!-- <b-alert show variant="secondary" class="display-string">
        {{ result }}
      </b-alert> -->
      <b-button
        v-if="
          $store.state.vmixState.activeTitles[component.filename] ===
          $store.state.db.components[component.id].resultString
        "
        variant="danger"
        size="sm"
        class="show-btn"
        @click="sendTitle"
      >
        Снять
      </b-button>
      <b-button
        v-if="
          $store.state.vmixState.activeTitles[component.filename] !==
          $store.state.db.components[component.id].resultString
        "
        variant="primary"
        size="sm"
        class="show-btn"
        @click="sendTitle"
      >
        Вывести
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
      sendedResult: '',
      selectedRows: [],
      componentData: {},
      columns: {},
      left: '#',
      right: '#',
    };
  },
  async beforeMount() {},
  mounted() {
    this.columns = JSON.parse(JSON.stringify(this.component.columns));
    this.componentData = { ...this.component };
  },
  methods: {
    saveConfig() {
      const { filename, overlay, name, autoclose, uppercase } =
        this.componentData;
      this.$refs.dropdown.hide(true);
      this.$store.commit('writeQuadParams', {
        componentId: this.component.id,
        filename,
        overlay,
        name,
        autoclose,
        uppercase,
      });
      this.$store.dispatch('saveDB');
    },
    radioHandler(event, position) {
      const id = event.target.id;
      const selector = `.duo-input${id}`;
      if (event.target.checked) {
        const currentComp = document.getElementById(this.component.id);
        const allCheckBox = currentComp.querySelectorAll(
          `.duo-form-${position} input[type=checkbox]`
        );
        allCheckBox.forEach((elem) => (elem.checked = false));
        event.target.checked = true;
        // const textNodes = [];
        currentComp.querySelectorAll(selector).forEach((elem) => {
          this[position] = elem.value;
          // textNodes.push(elem.value);
        });
        // this[position] = textNodes.join('#');
      } else {
        this[position] = '';
        // this[position] = '#';
      }
      this.show();
    },
    validate(event) {
      if (this.component.uppercase) {
        event.target.value = event.target.value.toUpperCase();
      }
    },
    writeColumns(id, position) {
      const currentComp = document.getElementById(this.component.id);
      const currentString = currentComp.querySelector('.checkbox' + id);
      const componentId = this.component.id;
      this.$store.commit('updateColumns', {
        componentId,
        columns: this.columns,
      });
      this.$store.dispatch('saveDB');
      if (currentString.checked === true) {
        const event = {
          target: currentString,
        };
        this.radioHandler(event, position);
      }
    },
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
      this.$store.dispatch('saveDB');
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
      });
    },
  },
};
</script>

<style scoped>
.duo-title {
  /* max-width: 450px; */
}

.duo-input {
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
    'duo-form-left duo-form-right'
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
