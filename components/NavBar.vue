<template>
  <b-navbar type="dark" variant="dark" class="nav-flex-container">
    <b-navbar-nav>
      <b-nav-item><router-link to="/">Home</router-link></b-nav-item>

      <!-- Navbar dropdowns -->
      <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#"> Settings </b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item><router-link to="/config">Config</router-link></b-nav-item>
    </b-navbar-nav>
    <div v-if="$store.state.vmixState.overlays" class="overlays-indicator">
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
    overlayOut(input) {
      this.$store.commit('clearTimer', { input });
      return this.$store.state.stateMachine[input].running();
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
.overlays-indicator-btn {
  cursor: pointer;
}
</style>
