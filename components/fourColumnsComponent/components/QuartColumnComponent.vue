<template>
  <div>
    <QuartStringComponent
      v-for="(value, id) in columns"
      :id="id"
      :key="id"
      v-model="columns[id]"
      :uppercase="component.uppercase"
      :active-string="activeString"
      @click="checkboxHandler(id)"
      @write-result="setResult($event)"
      @save-columns="saveColumns"
    />
  </div>
</template>

<script>
import QuartStringComponent from './components/QuartStringComponent.vue';
export default {
  components: {
    QuartStringComponent,
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
      this.columns = { ...this.component.columns[this.position] };
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
      const columns = {
        [this.position]: { ...this.columns },
      };
      this.$store.commit('updateColumns', {
        componentId,
        columns: { ...this.component.columns, ...columns },
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
