<template>
  <b-dropdown-form class="dropdown-body">
    <b-form-group label="Title" label-for="config-header" @submit.stop.prevent>
      <b-form-input
        id="config-header"
        v-model="data.name"
        class="config-input-item-field"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Color" label-for="config-color" @submit.stop.prevent>
      <b-form-select
        id="config-color"
        v-model="data.color"
        :options="$store.state.colors"
        size="sm"
        class="mt-3 config-input-item-field"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Filename"
      label-for="config-filename"
      @submit.stop.prevent
    >
      <b-form-select
        v-if="Object.keys($store.state.vmixStore).length"
        id="config-filename"
        v-model="data.filename"
        :disabled="isActive"
        :options="$store.state.vmixStore.titles.values"
        size="sm"
        class="mt-3 config-input-item-field"
      ></b-form-select>
    </b-form-group>

    <b-form-group label="Overlay" label-for="dropdown-overlay">
      <b-form-select
        id="config-overlay"
        v-model="data.overlay"
        :disabled="isActive"
        :options="$store.state.vmixOverlays"
        size="sm"
        class="mt-3 config-input-item-field"
      ></b-form-select>
    </b-form-group>

    <b-form-checkbox v-model="data.autoclose" class="mb-3"
      >Autoclose(10s)</b-form-checkbox
    >
    <span class="config-controls-wrapper">
      <RectButton
        :text="'Delete'"
        :btn-style="'danger'"
        @click="$emit('delete-button')"
      />
      <RectButton :text="'Save'" :btn-style="'primary'" @click="saveConfig" />
    </span>
  </b-dropdown-form>
</template>

<script>
import RectButton from '../../../sharedComponents/RectButton.vue';
export default {
  components: {
    RectButton,
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  emits: ['save-button', 'delete-button'],
  data() {
    return {
      data: {},
    };
  },
  created() {
    this.data = JSON.parse(JSON.stringify(this.value));
  },
  methods: {
    saveConfig() {
      this.$emit('save-button', this.data);
    },
  },
};
</script>

<style scoped>
.config-controls-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
