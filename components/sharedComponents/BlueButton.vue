<template>
  <b-button
    class="config-input-add-btn"
    variant="primary"
    href="#"
    @click="$emit('click-event')"
  >
    {{ text }}
  </b-button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  emits: ['click-event'],
};
</script>

<style scoped></style>
