<template>
  <div>
    <div v-for="(value, id) in columns" :key="id" :class="`duo-form${id}`">
      <StringComponent
        :id="id"
        v-model="columns[id].value"
        :uppercase="component.uppercase"
        :active-string="activeString"
        @click="checkboxHandler(id)"
        @write-result="setResult($event)"
        @save-columns="saveColumns"
      />
    </div>
  </div>
</template>

<script>
import StringComponent from './components/StringComponent.vue';
export default {
  components: {
    StringComponent,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  emits: ['save-event'],
  data() {
    return {
      columns: {},
      activeString: '',
    };
  },
  created() {
    this.importColumns();
  },
  methods: {
    importColumns() {
      Object.values(this.component.columns)
        .filter((column) => column.position === this.position)
        .forEach((column) => {
          this.columns[column.id] = { ...column };
        });
    },
    checkboxHandler(id) {
      this.activeString = id;
    },
    setResult($event) {
      this.$emit('input', $event);
      this.$emit('save-event');
    },
    saveColumns() {
      const componentId = this.component.id;
      this.$store.commit('updateColumns', {
        componentId,
        columns: { ...this.component.columns, ...this.columns },
      });
    },
  },
};
</script>

<style scoped>
.duo-input {
  height: 25px !important;
}
p,
.input-string,
.input-group {
  margin: 0 !important;
}
input {
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  padding: 2px 5px;
}
</style>
