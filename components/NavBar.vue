<template>
  <b-navbar type="dark" variant="dark" class="nav-flex-container">
    <b-navbar-nav>
      <b-navbar-brand href="#">
        <img src="/logo.png" class="d-inline-block align-top" alt="logo" />
        vMix Title Controller
      </b-navbar-brand>
    </b-navbar-nav>
    <div v-if="$store.state.vmixState.overlays" class="overlays-indicator">
      <!-- <b-badge
        pill
        class="input-remove-btn"
        variant="danger"
        @click="removeInputs"
        >Очистить инпуты vMix</b-badge
      > -->
      <b-badge
        pill
        class="overlays-dasable-btn"
        variant="danger"
        @click="overlayOutAll"
        >Снять всё</b-badge
      >
      <b-badge
        pill
        class="overlays-indicator-btn"
        :variant="
          ($store.state.vmixState.overlays[0] && 'success') || 'secondary'
        "
        @click="overlayOut(1)"
        >1</b-badge
      >
      <b-badge
        pill
        class="overlays-indicator-btn"
        :variant="
          ($store.state.vmixState.overlays[1] && 'success') || 'secondary'
        "
        @click="overlayOut(2)"
        >2</b-badge
      >
      <b-badge
        pill
        class="overlays-indicator-btn"
        :variant="
          ($store.state.vmixState.overlays[2] && 'success') || 'secondary'
        "
        @click="overlayOut(3)"
        >3</b-badge
      >
      <b-badge
        pill
        class="overlays-indicator-btn"
        :variant="
          ($store.state.vmixState.overlays[3] && 'success') || 'secondary'
        "
        @click="overlayOut(4)"
        >4</b-badge
      >
    </div>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  async beforeMount() {
    // this.getCurrentStatus(this);
  },
  methods: {
    console(value) {
      alert(value);
    },
    // removeInputs() {
    //   return this.$store.dispatch('clearVmixInputs');
    // },
    overlayOut(input) {
      this.$store.commit('clearTimer', { input });
      return this.$store.state.stateMachine[input].running();
    },
    overlayOutAll() {
      for (const i in Object.keys(this.$store.state.timers)) {
        this.$store.commit('clearTimer', { input: i });
      }
      return this.$store.dispatch('overlayOutAll');
    },
  },
};
</script>

<style scoped>
.nav-flex-container {
  display: flex;
  justify-content: space-between;
}
.nav-bts {
  display: flex;
}
.overlays-dasable-btn {
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 30px;
  cursor: pointer;
}
.overlays-indicator-btn {
  cursor: pointer;
}
</style>
