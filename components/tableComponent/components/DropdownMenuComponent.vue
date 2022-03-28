<template>
  <b-dropdown variant="outline" class="table-btn-dropdown">
    <b-dropdown-item-button
      v-if="haveColumns"
      class="dropdown-item"
      @click.native.capture.stop="$emit('add-row-event')"
    >
      Вставить строку
    </b-dropdown-item-button>
    <b-dropdown-item-button
      v-if="haveColumns"
      class="dropdown-item"
      @click="$emit('remove-row-event')"
    >
      Удалить выбранные
    </b-dropdown-item-button>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item-button
      v-b-modal:[`modal-xl-${componentId}`]
      class="dropdown-item"
      @click="$emit('config-component-event')"
    >
      Настройки
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    componentId: {
      type: String,
      required: true,
    },
    haveColumns: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['add-row-event', 'remove-row-event', 'config-component-event'],
  methods: {},
};
</script>

<style scoped>
::v-deep .btn {
  padding: 0 6px !important;
}
</style>
