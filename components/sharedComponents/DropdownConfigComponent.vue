<template>
  <b-dropdown
    id="dropdown-form"
    ref="dropdown"
    text="Настройки"
    class="m-2 config-btn"
  >
    <b-dropdown-form class="dropdown-body">
      <b-form-group
        label="Название"
        label-for="config-header"
        @submit.stop.prevent
      >
        <b-form-input
          id="config-header"
          v-model="componentData.name"
          autocomplete="off"
          class="config-input-item-field"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Имя файла"
        label-for="config-filename"
        @submit.stop.prevent
      >
        <b-form-select
          v-if="Object.keys($store.state.vmixStore).length"
          id="config-filename"
          v-model="componentData.filename"
          :disabled="isActive"
          :options="$store.state.vmixStore.titles.values"
          size="sm"
          class="mt-3 config-input-item-field"
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Слой" label-for="dropdown-overlay">
        <b-form-select
          id="config-overlay"
          v-model="componentData.overlay"
          :disabled="isActive"
          :options="$store.state.vmixOverlays"
          size="sm"
          class="mt-3 config-input-item-field"
        ></b-form-select>
      </b-form-group>

      <b-form-checkbox v-model="componentData.autoclose" class="mb-3"
        >Автозакрытие</b-form-checkbox
      >
      <b-form-checkbox v-model="componentData.uppercase" class="mb-3"
        >Регистр</b-form-checkbox
      >
      <b-button variant="primary" size="sm" @click="saveConfig"
        >Сохранить</b-button
      >
    </b-dropdown-form>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    component: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['add-row-event', 'remove-row-event', 'config-component-event'],
  data() {
    return {
      componentData: {},
    };
  },
  created() {
    this.configComponent();
  },
  methods: {
    configComponent() {
      this.componentData = JSON.parse(JSON.stringify(this.component));
    },
    saveConfig() {
      const { filename, overlay, name, autoclose, uppercase } =
        this.componentData;
      this.$refs.dropdown.hide(true);
      this.$store.commit('writeParams', {
        componentId: this.component.id,
        filename,
        overlay,
        name,
        autoclose,
        uppercase,
      });
      this.$store.dispatch('saveDB');
    },
  },
};
</script>

<style scoped>
::v-deep .btn {
  padding: 0 6px !important;
}
input {
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  padding: 2px 5px;
}
</style>
