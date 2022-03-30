<template>
  <div>
    <PhoneStringComponent
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
import PhoneStringComponent from './components/PhoneStringComponent.vue';
export default {
  components: {
    PhoneStringComponent,
  },
  props: {
    component: {
      type: Object,
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
      this.columns = { ...this.component.columns };
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

<style scoped></style>
