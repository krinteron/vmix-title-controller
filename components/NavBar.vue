<template>
  <b-navbar type="dark" variant="dark">
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
  },
};
</script>

<style></style>
