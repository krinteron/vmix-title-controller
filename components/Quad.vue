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
              class="mt-3 config-input-item-field blocked"
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
      <div class="column-1 top-left">
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topLeft"
                type="checkbox"
                :value="component.columns.topLeft[1]"
                class="checkbox-tl1"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topLeft[1].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl1')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl1')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topLeft"
                type="checkbox"
                :value="component.columns.topLeft[2]"
                class="checkbox-tl2"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topLeft[2].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl2')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl2')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topLeft"
                type="checkbox"
                :value="component.columns.topLeft[3]"
                class="checkbox-tl3"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topLeft[3].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl3')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl3')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topLeft"
                type="checkbox"
                :value="component.columns.topLeft[4]"
                class="checkbox-tl4"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topLeft[4].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl4')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl4')"
            ></b-form-input>
          </b-input-group>
        </p>
      </div>
      <div class="column-2 top-right">
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topRight"
                type="checkbox"
                :value="component.columns.topRight[1]"
                class="checkbox-tr1"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topRight[1].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr1')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr1')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topRight"
                type="checkbox"
                :value="component.columns.topRight[2]"
                class="checkbox-tr2"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topRight[2].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr2')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr2')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topRight"
                type="checkbox"
                :value="component.columns.topRight[3]"
                class="checkbox-tr3"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topRight[3].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr3')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr3')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topRight"
                type="checkbox"
                :value="component.columns.topRight[4]"
                class="checkbox-tr4"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topRight[4].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr4')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr4')"
            ></b-form-input>
          </b-input-group>
        </p>
      </div>
      <div class="column-1 bottom-left">
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomLeft"
                type="checkbox"
                :value="component.columns.bottomLeft[1]"
                class="checkbox-bl1"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomLeft[1].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl1')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl1')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomLeft"
                type="checkbox"
                :value="component.columns.bottomLeft[2]"
                class="checkbox-bl2"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomLeft[2].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl2')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl2')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomLeft"
                type="checkbox"
                :value="component.columns.bottomLeft[3]"
                class="checkbox-bl3"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomLeft[3].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl3')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl3')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomLeft"
                type="checkbox"
                :value="component.columns.bottomLeft[4]"
                class="checkbox-bl4"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomLeft[4].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl4')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl4')"
            ></b-form-input>
          </b-input-group>
        </p>
      </div>
      <div class="column-2 bottom-right">
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomRight"
                type="checkbox"
                :value="component.columns.bottomRight[1]"
                class="checkbox-br1"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomRight[1].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-br1')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br1')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomRight"
                type="checkbox"
                :value="component.columns.bottomRight[2]"
                class="checkbox-br2"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomRight[2].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-br2')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br2')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomRight"
                type="checkbox"
                :value="component.columns.bottomRight[3]"
                class="checkbox-br3"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              v-model="columns.bottomRight[3].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-br3')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br3')"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomRight"
                type="checkbox"
                :value="component.columns.bottomRight[4]"
                class="checkbox-br4"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              v-model="columns.bottomRight[4].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-br4')"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br4')"
            ></b-form-input>
          </b-input-group>
        </p>
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
      result: '',
      selectedRows: [],
      componentData: {},
      columns: {},
      topLeft: '#',
      topRight: '#',
      bottomLeft: '#',
      bottomRight: '#',
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
      if (event.target.checked) {
        const currentComp = document.getElementById(this.component.id);
        const allCheckBox = currentComp.querySelectorAll(`#${id}`);
        allCheckBox.forEach((elem) => (elem.checked = false));
        event.target.checked = true;
        this[id] =
          event.target._value.firstname + '#' + event.target._value.lastname;
      } else {
        this[id] = '#';
      }
      this.show();
    },
    async writeColumns(classname) {
      const currentComp = document.getElementById(this.component.id);
      const currentString = currentComp.querySelector(classname);
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
      });
    },
  },
};
</script>

<style scoped>
.quad-title {
  max-width: 600px;

  /* min-width: 30vw; */
  /* height: 60vh; */
  /* margin: 10px; */
}

.quad-input {
  height: 25px !important;
}

p,
.input-string,
.input-group {
  margin: 0 !important;
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
    'top-left top-right'
    'bottom-left bottom-right'
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
