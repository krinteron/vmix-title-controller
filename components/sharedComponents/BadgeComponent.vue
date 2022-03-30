<template>
  <b-badge :variant="color || 'secondary'" class="status-badge">
    {{ title || 'header' }}
  </b-badge>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
      required: false,
    },
    color: {
      type: String,
      default: null,
      required: false,
    },
  },
};
</script>

<style scoped>
.status-badge {
  grid-area: status-badge;
  line-height: 32px;
}
</style>
