<template>
  <div class="body">
    <div v-if="!$store.state.vmixIsOnline" class="vmix-down">
      <b-alert show variant="danger">
        <a href="#" class="alert-link">vmix is DOWN</a>
      </b-alert>
      <div>
        <b-input-group size="sm" class="mb-3">
          <b-form-input v-model="vmixHost"></b-form-input>
          <b-input-group-append>
            <b-button
              size="sm"
              text="Button"
              variant="success"
              @click="changeVmixHost"
              >Button</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div v-if="$store.state.vmixIsOnline" class="vmix-up">
      <NavBar />
      <div class="title-controllers">
        <b-tabs content-class="mt-3">
          <span v-if="$store.state.db.programs">
            <b-tab
              v-for="programId in Object.keys($store.state.db.programs)"
              :key="programId"
              :title="$store.state.db.programs[programId].programName"
              active
              class="tab-flex-container"
            >
              <template #title>
                <strong v-if="$store.state.db.programs[programId]">
                  {{ $store.state.db.programs[programId].programName }}
                </strong>
                <b-dropdown variant="outline" size="sm">
                  <b-dropdown-item-button
                    v-b-modal:[`modal-xl-${programId}`]
                    class="dropdown-item"
                    @click="configProgram(programId)"
                  >
                    Настройки
                  </b-dropdown-item-button>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item-button
                    class="dropdown-item"
                    @click="removeProgram(programId)"
                  >
                    Удалить
                  </b-dropdown-item-button>
                </b-dropdown>
              </template>
              <div
                v-for="componentId in $store.state.db.programs[programId].order"
                :key="componentId"
                class="tab-flex-item"
              >
                <component
                  :is="
                    $store.state.db.components[componentId].titlerComponentName
                  "
                  :component="$store.state.db.components[componentId]"
                />
              </div>
            </b-tab>
          </span>

          <template #tabs-end>
            <b-nav-item
              role="presentation"
              href="#"
              @click.prevent="addProgram"
            >
              <b>+</b>
            </b-nav-item>
          </template>
        </b-tabs>
      </div>
      <b-modal
        v-if="Object.keys(program).length"
        :id="`modal-xl-${program.id}`"
        size="xl"
        title="Настройки программы"
        @ok="saveConfig()"
      >
        <div class="input-group component-control">
          <b-input-group prepend="Название программы" class="mt-3">
            <b-form-input
              id="config-header input-small"
              v-model="program.programName"
              class="config-input-item-field"
            ></b-form-input>
          </b-input-group>
          <b-form-select
            v-model="selectedComponent"
            class="form-control component-control-item"
            :options="componentsList"
          ></b-form-select>
          <span class="input-group-btn component-control-item">
            <b-button
              class="config-input-add-btn"
              variant="primary"
              href="#"
              @click="addComponent(program.id)"
              >Добавить контроллер</b-button
            >
          </span>
        </div>

        <hr />

        <draggable
          v-model="orders[program.id]"
          @end="componentMoved(program.id)"
        >
          <transition-group
            tag="span"
            name="component"
            class="modal-flex-container"
          >
            <div
              v-for="componentId in orders[program.id]"
              :key="componentId"
              class="config-input-form"
            >
              <div
                v-if="$store.state.db.components[componentId]"
                class="config-remove-btn-wrapper"
              >
                {{
                  $store.state.db.components[componentId].titlerComponentName
                }}
                <div
                  class="config-remove-btn"
                  @click="removeComponent(program.id, componentId)"
                >
                  <div class="cros-line-1"></div>
                  <div class="cros-line-2"></div>
                </div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </b-modal>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';
export default {
  components: {
    draggable,
  },
  data() {
    return {
      program: {},
      orders: {},
      components: [],
      selectedComponent: '',
      componentsList: [
        { value: 'MainTitle', text: 'Таблица' },
        { value: 'Hrip', text: 'Хрип' },
        { value: 'Quad', text: 'Квартет' },
        { value: 'Button', text: 'Кнопка' },
      ],
      vmixHost: '',
    };
  },
  async beforeMount() {
    await this.$store.dispatch('getVmixState');
    await this.$store.dispatch('getTitles');
    await this.$store.dispatch('getVmixStore');
    this.$store.dispatch('startStateEvent');
    this.$store.dispatch('setStateMachine');
    this.vmixHost = this.$store.state.vmixHost;
  },
  updated() {
    if (this.$store.state.vmixIsOnline) {
      Object.values(this.$store.state.db.programs).forEach((program) => {
        this.orders[program.id] = [...program.order];
      });
    }
  },
  methods: {
    sortComponents() {},
    componentMoved(programId) {
      this.$store.commit('writeOrderComponents', {
        programId,
        newOrder: this.orders[programId],
      });
    },
    addProgram() {
      const programId = uuidv4();
      const newProgram = {
        programName: 'New Program',
        id: programId,
        order: [],
      };
      this.$store.commit('addProgram', { programId, newProgram });
      this.$store.dispatch('getTitles');
    },

    configProgram(programId) {
      this.program = { ...this.$store.state.db.programs[programId] };
      this.components = Object.values(this.$store.state.db.components).filter(
        (component) => component.programId === this.program.id
      );
    },

    async removeProgram(programId) {
      const confirmation = confirm('Удалить программу?');
      if (!confirmation) return;
      this.$store.commit('removeProgram', programId);
      await this.$store.dispatch('getTitles');
    },

    addComponent(programId) {
      if (!this.selectedComponent) return;
      const id = uuidv4();
      const component = {
        id,
        programId,
        titlerComponentName: this.selectedComponent,
        columns: {},
        rows: [],
      };
      if (this.selectedComponent === 'Quad') {
        component.resultString = '';
        component.filename = '';
        component.overlay = 1;
        component.autoclose = false;
        const data = {
          1: {
            id: '1',
            firstname: '',
            lastname: '',
          },
          2: {
            id: '2',
            firstname: '',
            lastname: '',
          },
          3: {
            id: '3',
            firstname: '',
            lastname: '',
          },
          4: {
            id: '4',
            firstname: '',
            lastname: '',
          },
        };
        component.columns = {
          topLeft: { ...data },
          topRight: { ...data },
          bottomLeft: { ...data },
          bottomRight: { ...data },
        };
      }
      if (this.selectedComponent === 'Hrip') {
        component.resultString = '';
        component.filename = '';
        component.overlay = 1;
        component.autoclose = false;
        component.columns = {
          1: {
            id: '1',
            name: '',
            job: '',
            photo: '',
          },
          2: {
            id: '2',
            name: '',
            job: '',
            photo: '',
          },
          3: {
            id: '3',
            name: '',
            job: '',
            photo: '',
          },
          4: {
            id: '4',
            name: '',
            job: '',
            photo: '',
          },
          5: {
            id: '5',
            name: '',
            job: '',
            photo: '',
          },
          6: {
            id: '6',
            name: '',
            job: '',
            photo: '',
          },
          7: {
            id: '7',
            name: '',
            job: '',
            photo: '',
          },
          8: {
            id: '8',
            name: '',
            job: '',
            photo: '',
          },
          9: {
            id: '9',
            name: '',
            job: '',
            photo: '',
          },
        };
      }

      this.$store.commit('addComponent', { id, component });
      this.configProgram(programId);
      this.selectedComponent = '';
      this.orders[programId].push(id);
      this.componentMoved(programId);
    },
    removeComponent(programId, componentId) {
      this.$store.commit('removeComponent', componentId);
      this.orders[programId] = this.orders[programId].filter(
        (id) => id !== componentId
      );
      this.componentMoved(programId);
      // this.$store.dispatch('getTitles');
      this.configProgram(programId);
    },
    saveConfig() {
      this.$store.commit('renameProgram', this.program);
    },
    changeVmixHost() {
      this.$store.commit('changeVmixHost', this.vmixHost);
    },
  },
};
</script>

<style scoped>
.body {
  width: 100vw;
  height: 100vh;
}

/* .modal-flex-container {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
 } */

.tab-flex-container {
  gap: 20px;
}

.tab-flex-item {
  flex-shrink: 1;
}

.component-control {
  display: flex;
  gap: 20px;
}

.modal-flex-container div {
  transition: all 0.3s;
}

.component-enter {
  opacity: 0;
}
.component-enter-to {
  opacity: 1;
  transition: opacity 0.5s;
}

.component-leave-to {
  opacity: 0;
  transition: opacity 0.5s;
}

.config-input-form {
  position: relative;
  width: 45%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
}

.config-input-item {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
}

.config-remove-btn-wrapper {
  display: flex;
  justify-content: space-between;
}

.config-remove-btn {
  position: relative;
  display: inline-block;
  height: 20px;
}

.config-remove-btn:hover div {
  background: #d00;
  transition: 0.2s;
}

.cros-line-1 {
  position: relative;
  width: 20px;
  height: 6px;
  top: 30%;
  background: rgb(214, 212, 212);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.cros-line-2 {
  position: relative;
  width: 20px;
  height: 6px;
  background: rgb(214, 212, 212);
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.title-controllers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
}
.tabs {
  width: 100%;
}
.tab-pane {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
