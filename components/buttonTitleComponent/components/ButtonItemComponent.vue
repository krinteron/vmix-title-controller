<template>
  <b-dropdown
    ref="dropdown"
    class="m-2"
    split
    size="sm"
    :split-variant="buttonData.color"
    :variant="(isActive() && 'success') || 'outline-secondary'"
    :text="buttonData.name"
    @click="$emit('click')"
  >
    <DropdownConfigButtonComponent
      v-model="buttonData"
      :is-active="isActive()"
      @save-button="saveConfig"
      @delete-button="$emit('remove-column', buttonData.id)"
    />
  </b-dropdown>
</template>

<script>
import DropdownConfigButtonComponent from './components/DropdownConfigButtonComponent.vue';
export default {
  components: {
    DropdownConfigButtonComponent,
  },
  props: {
    button: {
      type: Object,
      required: true,
    },
  },
  emits: ['click', 'remove-column', 'save-columns'],
  data() {
    return {
      buttonData: {},
    };
  },
  created() {
    this.buttonData = JSON.parse(JSON.stringify(this.button));
  },
  methods: {
    isActive() {
      return Object.keys(this.$store.state.vmixState.activeTitles).includes(
        this.buttonData.filename
      );
    },
    saveConfig(data) {
      this.$refs.dropdown.hide(true);
      this.buttonData = { ...data };
      this.$emit('save-columns', this.buttonData);
    },
  },
};
</script>

<style scoped></style>
