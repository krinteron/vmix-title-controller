<template>
  <div class="body">
    <NavBar />
    <div class="title-controllers">
      <b-tabs v-if="$store.state.db.programs" content-class="mt-3">
        <b-tab
          v-for="programId in Object.keys($store.state.db.programs)"
          :key="programId"
          :title="$store.state.db.programs[programId].programName"
          active
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
            v-for="component in Object.values(
              $store.state.db.components
            ).filter((component) => component.programId === programId)"
            :key="component.id"
          >
            <component
              :is="component.titlerComponentName"
              :component="component"
            />
          </div>
        </b-tab>
        <template #tabs-end>
          <b-nav-item role="presentation" href="#" @click.prevent="addProgram">
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

      <transition-group
        tag="span"
        name="component"
        class="modal-flex-container"
      >
        <div
          v-for="component in components"
          :key="component.id"
          class="config-input-form"
        >
          <div class="config-remove-btn-wrapper">
            {{ component.titlerComponentName }}
            <div class="config-remove-btn" @click="removeComponent(component)">
              <div class="cros-line-1"></div>
              <div class="cros-line-2"></div>
            </div>
          </div>
        </div>
      </transition-group>
    </b-modal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {
      program: {},
      components: [],
      selectedComponent: '',
      componentsList: [
        { value: 'MainTitle', text: 'Таблица' },
        { value: 'MainTitle', text: 'Диптих' },
        { value: 'MainTitle', text: 'Триптих' },
        { value: 'MainTitle', text: 'Квартет' },
      ],
    };
  },
  async beforeMount() {
    await this.$store.dispatch('getVmixState');
    await this.$store.dispatch('getTitles');
    this.$store.dispatch('startStateEvent');
    this.$store.dispatch('setStateMachine');
  },
  methods: {
    addProgram() {
      const programId = uuidv4();
      const newProgram = {
        programName: 'New Program',
        id: programId,
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
      this.$store.commit('addComponent', { id, component });
      this.configProgram(programId);
      this.selectedComponent = '';
    },
    removeComponent(component) {
      this.$store.commit('removeComponent', component.id);
      // this.$store.dispatch('getTitles');
      this.configProgram(component.programId);
    },
    saveConfig() {
      this.$store.commit('renameProgram', this.program);
    },
  },
};
</script>

<style scoped>
.body {
  width: 100vw;
  height: 100vh;
}

.modal-flex-container {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  /* flex-direction: column; */
}

.component-control {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
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
