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
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {};
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
  },
};
</script>

<style scoped>
.body {
  width: 100vw;
  height: 100vh;
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
