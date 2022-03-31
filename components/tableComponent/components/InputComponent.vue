<template>
  <input
    :id="cell.id"
    readonly
    class="title-out pointer"
    type="text"
    autocomplete="off"
    :value="cell.value"
    @input="validate($event, cell.columnId)"
    @select.prevent="selectText($event)"
    @blur="blur($event, cell)"
    @contextmenu="editElem($event, cell)"
    @dblclick="$emit('dblclick-event', $event)"
  />
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      required: true,
    },
    uppercase: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['dblclick-event', 'save-event'],
  methods: {
    validate({ target }) {
      if (this.uppercase) {
        target.value = target.value.toUpperCase();
      }
    },
    // ____________________ЗАПРЕТ_ВЫДЕЛЕНИЯ_ТЕКСТА___________________
    selectText({ target }) {
      if (target.classList.contains('pointer')) {
        target.selectionStart = target.selectionEnd;
      }
    },
    // ____________________СОХРАНЕНИЕ_ПРИ_ПОТЕРЕ_ФОКУСА___________________
    blur(event, cell) {
      if (event.target.classList.contains('pointer')) return;
      this.editElem(event, cell);
    },
    // ____________________РЕДАКТИРОВАНИЕ_ТЕКСТА___________________
    editElem(event) {
      event.preventDefault();
      if (event.target.classList.contains('active')) return;
      event.target.toggleAttribute('readonly');
      event.target.classList.toggle('pointer');
      event.target.classList.toggle('editable');
      if (event.target.classList.contains('editable')) {
        this.$store.dispatch('stopStateEvent');
      } else {
        this.$emit('save-event', event);
        this.$store.dispatch('startStateEvent');
      }
    },
  },
};
</script>

<style scoped>
.title-out {
  border: none;
  width: 100%;
  height: 100%;
  outline: none;
  text-align: center;
  font-weight: 500;
}
.pointer {
  cursor: pointer;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
input:hover {
  background: #97cded;
  transition: 0.2s;
}
</style>
