<template>
  <div v-if="$store.state.db.components" class="body">
    <component
      :is="
        $store.state.db.components['94eadb03-2b75-4519-9e61-2ca209b7080e']
          .titlerComponentName
      "
      :key="e"
      class="tab-flex-item table1"
      :component="
        $store.state.db.components['94eadb03-2b75-4519-9e61-2ca209b7080e']
      "
    />
    <component
      :is="
        $store.state.db.components['bd514ddd-a697-4a2a-ae68-a9cc534bdbcd']
          .titlerComponentName
      "
      :key="e"
      class="tab-flex-item button"
      :component="
        $store.state.db.components['bd514ddd-a697-4a2a-ae68-a9cc534bdbcd']
      "
    />
    <component
      :is="
        $store.state.db.components['8e4de3d1-eb0d-438c-8296-b07376974c0a']
          .titlerComponentName
      "
      :key="e"
      class="tab-flex-item hrip"
      :component="
        $store.state.db.components['8e4de3d1-eb0d-438c-8296-b07376974c0a']
      "
    />
    <component
      :is="
        $store.state.db.components['0cf3ce11-e222-450a-a2bc-014c96c2ceb2']
          .titlerComponentName
      "
      :key="e"
      class="tab-flex-item quad"
      :component="
        $store.state.db.components['0cf3ce11-e222-450a-a2bc-014c96c2ceb2']
      "
    />
    <component
      :is="
        $store.state.db.components['457df4d6-a3b8-4189-be1b-21c88c81c744']
          .titlerComponentName
      "
      :key="e"
      class="tab-flex-item table2"
      :component="
        $store.state.db.components['457df4d6-a3b8-4189-be1b-21c88c81c744']
      "
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      programs: this.$store.state.titles,
    };
  },
  async beforeMount() {
    await this.$store.dispatch('getVmixState');
    await this.$store.dispatch('getTitles');
    this.$store.dispatch('startStateEvent');
    this.$store.dispatch('setStateMachine');
  },
  methods: {
    // getData() {
    //   const elem = document.getElementById(id);
    // },
  },
};
</script>

<style scoped>
.body {
  padding: 10px;
  /* grid-template-rows: [row1-start] min-content [row1-end] min-content [third-line] auto [last-line]; */
  /* grid-row: auto; */
  grid-template-rows: min-content min-content 1fr;

  height: calc(100vh - 10px);
  /* grid-template-rows: min-content; */
  width: 100vw;
  /* overflow: hidden; */
  gap: 20px 30px;
  display: grid;
  align-items: start;
  grid-template-areas:
    'button button button button'
    'hrip quad table1 table1'
    'table2 table2 table1 table1';
}
.table1 {
  grid-area: table1;
}
.table2 {
  grid-area: table2;
  align-self: start;
}
.button {
  grid-area: button;
}
.hrip {
  grid-area: hrip;
}
.quad {
  grid-area: quad;
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
