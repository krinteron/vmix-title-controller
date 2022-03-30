<template>
  <div
    :id="component.id"
    :style="{ 'grid-area': component.id }"
    class="quad-title"
  >
    <div v-if="Object.keys(columns).length" class="editor">
      <b-badge
        :variant="(isActive && 'success') || 'secondary'"
        class="status-badge"
        >{{ component.name || 'header' }}</b-badge
      >
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
      <!-- <div class="column-1 top-left">
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl1')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl2')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl3')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl4')"
              @keyup="validate($event)"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topLeft"
                type="checkbox"
                :value="component.columns.topLeft[5]"
                class="checkbox-tl5"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topLeft[5].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl5')"
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topLeft[5].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tl5')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr1')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr2')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr3')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr4')"
              @keyup="validate($event)"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="topRight"
                type="checkbox"
                :value="component.columns.topRight[5]"
                class="checkbox-tr5"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.topRight[5].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr5')"
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.topRight[5].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-tr5')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl1')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl2')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl3')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl4')"
              @keyup="validate($event)"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomLeft"
                type="checkbox"
                :value="component.columns.bottomLeft[5]"
                class="checkbox-bl5"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              id="firstname"
              v-model="columns.bottomLeft[5].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl5')"
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomLeft[5].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-bl5')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[1].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br1')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[2].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br2')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[3].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br3')"
              @keyup="validate($event)"
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
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[4].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br4')"
              @keyup="validate($event)"
            ></b-form-input>
          </b-input-group>
        </p>
        <p class="input-string">
          <b-input-group class="mb-2">
            <b-input-group-prepend class="quad-input" is-text>
              <input
                id="bottomRight"
                type="checkbox"
                :value="component.columns.bottomRight[5]"
                class="checkbox-br5"
                @click="radioHandler($event)"
              />
            </b-input-group-prepend>
            <b-form-input
              v-model="columns.bottomRight[5].firstname"
              class="quad-input"
              @change="writeColumns('.checkbox-br5')"
              @keyup="validate($event)"
            ></b-form-input>
            <b-form-input
              id="lastname"
              v-model="columns.bottomRight[5].lastname"
              class="quad-input"
              @change="writeColumns('.checkbox-br5')"
              @keyup="validate($event)"
            ></b-form-input>
          </b-input-group>
        </p>
      </div> -->
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
import DropdownConfigComponent from '../sharedComponents/DropdownConfigComponent.vue';
import QuartComponent from './components/QuartComponent.vue';
export default {
  components: {
    DropdownConfigComponent,
    QuartComponent,
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
      columns: {},
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
  created() {
    this.columns = JSON.parse(JSON.stringify(this.component.columns));
  },
  methods: {
    // radioHandler(event) {
    //   const id = event.target.id;
    //   if (event.target.checked) {
    //     const currentComp = document.getElementById(this.component.id);
    //     const allCheckBox = currentComp.querySelectorAll(`#${id}`);
    //     allCheckBox.forEach((elem) => (elem.checked = false));
    //     event.target.checked = true;
    //     this[id] =
    //       event.target._value.firstname + '#' + event.target._value.lastname;
    //   } else {
    //     this[id] = '#';
    //   }
    //   this.show();
    // },
    // validate(event) {
    //   if (this.component.uppercase) {
    //     event.target.value = event.target.value.toUpperCase();
    //   }
    // },
    // async writeColumns(classname) {
    //   const currentComp = document.getElementById(this.component.id);
    //   const currentString = currentComp.querySelector(classname);
    //   const componentId = this.component.id;
    //   this.$store.commit('updateColumns', {
    //     componentId,
    //     columns: this.columns,
    //   });
    //   await this.$store.dispatch('saveDB');
    //   if (currentString.checked === true) {
    //     const event = {
    //       target: currentString,
    //     };
    //     this.radioHandler(event);
    //   }
    // },
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
      this.$store.commit('writeQuadResultString', {
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
.quad-title {
}

/* .quad-input {
  height: 25px !important;
} */

/* p,
.input-string,
.input-group {
  margin: 0 !important;
} */

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
