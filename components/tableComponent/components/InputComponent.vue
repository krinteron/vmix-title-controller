<template>
  <input
    :id="cell.id"
    readonly
    class="title-out pointer"
    type="text"
    autocomplete="off"
    :value="cell.value"
    @keyup="validate($event, cell.columnId)"
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
    validate(event) {
      const id = event.target.id;
      const element = document.getElementById(id);
      if (this.uppercase) {
        element.value = element.value.toUpperCase();
      }
    },
    // ____________________ЗАПРЕТ_ВЫДЕЛЕНИЯ_ТЕКСТА___________________
    selectText({ target }) {
      const id = target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('pointer')) {
        element.selectionStart = element.selectionEnd;
      }
    },
    // ____________________СОХРАНЕНИЕ_ПРИ_ПОТЕРЕ_ФОКУСА___________________
    blur(event, cell) {
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('pointer')) return;
      this.editElem(event, cell);
    },
    // ____________________РЕДАКТИРОВАНИЕ_ТЕКСТА___________________
    editElem(event) {
      event.preventDefault();
      const id = event.target.id;
      const element = document.getElementById(id);
      if (element.classList.contains('active')) return;
      element.toggleAttribute('readonly');
      element.classList.toggle('pointer');
      element.classList.toggle('editable');
      if (element.classList.contains('editable')) {
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
