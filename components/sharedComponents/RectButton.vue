<template>
  <b-button :variant="btnStyle" size="sm" @click="$emit('click')">
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
    btnStyle: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  emits: ['click'],
};
</script>

<style scoped></style>
