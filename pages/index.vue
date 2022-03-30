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
              >Enter</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div v-if="$store.state.vmixIsOnline" class="vmix-up">
      <NavBar />
      <b-tabs content-class="mt-3">
        <span v-if="$store.state.db.programs">
          <b-tab
            v-for="programId in Object.keys($store.state.db.programs)"
            :key="programId"
            :title="$store.state.db.programs[programId].programName"
            active
          >
            <!-- __________________Заголовки вкладок____________________ -->
            <template #title>
              <strong v-if="$store.state.db.programs[programId]">
                {{ $store.state.db.programs[programId].programName }}
              </strong>
              <b-dropdown variant="outline" class="tab-btn-dropdown">
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
            <!-- __________________Тело вкладки____________________ -->
            <div
              :id="`tab-${programId}`"
              class="tab-grid-container"
              :style="{
                'grid-template-areas':
                  $store.state.db.programs[programId].areas,
              }"
            >
              <!-- __________________Тело компонента____________________ -->
              <component
                :is="
                  $store.state.db.components[component.id].titlerComponentName
                "
                v-for="component in Object.values(
                  $store.state.db.components
                ).filter((component) => component.programId === programId)"
                :key="component.id"
                :component="component"
              />
            </div>
          </b-tab>
        </span>
        <!-- __________________Добавление вкладок____________________ -->
        <template #tabs-end>
          <b-nav-item role="presentation" href="#" @click.prevent="addProgram">
            <b>+</b>
          </b-nav-item>
        </template>
      </b-tabs>
      <!-- __________________Модальное окно настроек вкладки____________________ -->
      <b-modal
        v-if="Object.keys(program).length"
        :id="`modal-xl-${program.id}`"
        size="xl"
        title="Настройки программы"
        @ok="saveConfig(program)"
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
            <RectButton
              text="Добавить контроллер"
              @click="addComponent(program.id)"
            />
          </span>
        </div>

        <hr />

        <div class="areas-flex-container">
          <!-- __________________Список компонентов____________________ -->
          <div class="areas-flex-container-item">
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
                  {{ $store.state.db.components[componentId].name }}
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
          </div>
          <!-- __________________Настройка Grid areas____________________ -->
          <div class="areas-flex-container-item">
            <b-table-simple>
              <b-tbody>
                <b-tr
                  v-for="row in Object.keys(program.areasOptions)"
                  :key="row"
                >
                  <b-td>
                    <b-form-select
                      v-model="program.areasOptions[row][0]"
                      :options="componentsIds"
                      size="sm"
                      class="mt-3"
                    ></b-form-select>
                  </b-td>
                  <b-td>
                    <b-form-select
                      v-model="program.areasOptions[row][1]"
                      :options="componentsIds"
                      size="sm"
                      class="mt-3"
                    ></b-form-select>
                  </b-td>
                  <b-td>
                    <b-form-select
                      v-model="program.areasOptions[row][2]"
                      :options="componentsIds"
                      size="sm"
                      class="mt-3"
                    ></b-form-select>
                  </b-td>
                  <b-td>
                    <b-form-select
                      v-model="program.areasOptions[row][3]"
                      :options="componentsIds"
                      size="sm"
                      class="mt-3"
                    ></b-form-select>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import MainTitle from '../components/tableComponent/MainTitle.vue';
import Hrip from '../components/phoneComponent/Hrip.vue';
import Duo from '../components/twoColumnsConponent/Duo.vue';
import Quad from '../components/fourColumnsComponent/Quad.vue';
import Button from '../components/Button.vue';
import RectButton from '../components/sharedComponents/RectButton.vue';
export default {
  components: { MainTitle, Hrip, Duo, Quad, Button, RectButton },
  data() {
    return {
      program: {},
      orders: {},
      components: [],
      componentsIds: [{ value: '.', text: '' }],
      templateAreas: {},
      currentComp: '',
      selectedComponent: '',
      componentsList: [
        { value: 'MainTitle', text: 'ТАБЛИЦА' },
        { value: 'Hrip', text: 'ХРИП' },
        { value: 'Duo', text: '2 ОКНА' },
        { value: 'Quad', text: '4 ОКНА' },
        { value: 'Button', text: 'КНОПКИ' },
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
      for (const key in this.$store.state.db.programs) {
        this.orders[key] = [...this.$store.state.db.programs[key].order];
      }
    }
  },
  methods: {
    addProgram() {
      const programId = uuidv4();
      const newProgram = {
        programName: 'New Program',
        id: programId,
        order: [],
        areasOptions: {
          row1: ['.', '.', '.', '.'],
          row2: ['.', '.', '.', '.'],
          row3: ['.', '.', '.', '.'],
        },
      };
      this.$store.commit('addProgram', { programId, newProgram });
      this.$store.dispatch('saveDB');
      // this.$store.dispatch('getTitles');
    },

    configProgram(programId) {
      this.program = { ...this.$store.state.db.programs[programId] };
      this.components = Object.values(this.$store.state.db.components).filter(
        (component) => component.programId === this.program.id
      );
      this.rewriteIdsOptions();
    },

    rewriteIdsOptions() {
      let count = 1;
      this.componentsIds.length = 1;
      this.components.forEach((component) => {
        this.componentsIds.push({
          value: component.id,
          text: `${component.name}-[${count++}]`,
        });
      });
    },

    writeTemplateAreas(program) {
      const areas = Object.values(program.areasOptions)
        .map((row) => `"${row.join(' ')}"`)
        .join(' ');
      this.templateAreas = areas;
      const element = document.getElementById('tab-' + program.id);
      element.style.gridTemplateAreas = areas;
    },

    removeProgram(programId) {
      const confirmation = confirm('Удалить программу?');
      if (!confirmation) return;
      this.$store.commit('removeProgram', programId);
      this.$store.dispatch('saveDB');
      // await this.$store.dispatch('getTitles');
    },

    addComponent(programId) {
      if (!this.selectedComponent) return;
      const id = 'a' + uuidv4();
      const component = {
        id,
        programId,
        name: 'ТАБЛИЦА',
        titlerComponentName: this.selectedComponent,
        uppercase: true,
        columns: {},
        rows: [],
      };
      if (this.selectedComponent === 'Button') {
        component.name = 'КНОПКИ';
      }
      if (this.selectedComponent === 'Duo') {
        component.resultString = '';
        component.filename = '';
        component.name = '2 ОКНА';
        component.overlay = 1;
        component.autoclose = false;
        for (const position of ['left', 'right']) {
          let i = 11;
          while (i-- > 0) {
            const id = uuidv4();
            component.columns[id] = {
              id,
              value: '',
              position,
              // job: '',
            };
          }
        }
      }
      if (this.selectedComponent === 'Quad') {
        component.resultString = '';
        component.filename = '';
        component.name = '4 ОКНА';
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
          5: {
            id: '5',
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
        component.name = 'ХРИП';
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
          10: {
            id: '10',
            name: '',
            job: '',
            photo: '',
          },
          11: {
            id: '11',
            name: '',
            job: '',
            photo: '',
          },
        };
      }

      this.$store.commit('addComponent', { component });
      this.$store.dispatch('saveDB');
      this.configProgram(programId);
      this.selectedComponent = '';
      this.orders[programId].push(id);
    },
    removeComponent(programId, componentId) {
      this.program.order = this.orders[programId].filter(
        (id) => id !== componentId
      );
      this.orders[programId] = [...this.program.order];
      this.rewriteIdsOptions();
      this.$store.commit('removeComponent', {
        program: this.program,
        componentId,
      });
      this.configProgram(programId);
      this.$store.dispatch('saveDB');
      // this.$store.dispatch('getTitles');
    },
    saveConfig() {
      this.writeTemplateAreas(this.program);
      this.program.areas = this.templateAreas;
      this.$store.commit('updateProgram', this.program);
      this.$store.dispatch('saveDB');
    },
    changeVmixHost() {
      this.$store.commit('changeVmixHost', this.vmixHost);
      this.$store.dispatch('saveDB');
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

::v-deep .nav-item .nav-link {
  padding: 4px 6px;
}

::v-deep .tab-btn-dropdown .btn {
  padding: 0 4px !important;
}

.tab-grid-container {
  display: grid !important;
  gap: 20px 30px;
  grid-template-rows: min-content min-content 1fr;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) 1fr 1fr;
  align-items: start;
  height: calc(100vh - 110px);
  padding: 0 10px 20px 10px;
}

.component-control {
  display: flex;
  gap: 20px;
}

.modal-flex-container div {
  transition: all 0.3s;
}

.areas-flex-container {
  display: flex;
}

.areas-flex-container-item {
  width: 50%;
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
  justify-content: flex-start;
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
.tabs {
  width: 100%;
}
</style>
