<template>
  <p class="input-string">
    <b-input-group class="mb-2">
      <b-input-group-prepend class="duo-input" is-text>
        <input
          ref="checkbox"
          :checked="activeString === id"
          type="checkbox"
          @click="radioHandler"
        />
      </b-input-group-prepend>
      <b-form-input
        ref="input"
        v-model="text"
        autocomplete="off"
        class="duo-input"
        @input="writeColumns"
      ></b-form-input>
    </b-input-group>
  </p>
</template>

<script>
export default {
  props: {
    uppercase: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    activeString: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: ['click', 'write-result', 'save-columns'],
  data() {
    return {
      text: this.value,
    };
  },
  methods: {
    radioHandler() {
      if (this.$refs.checkbox.checked) {
        this.$emit('click', this.id);
        this.$emit('write-result', this.text);
      } else {
        this.$emit('click', 'null');
        this.$emit('write-result', '');
      }
    },
    validate() {
      if (this.uppercase) {
        this.text = this.text.toUpperCase();
      }
    },
    async writeColumns() {
      this.validate();
      this.$emit('input', this.text);
      this.$emit('save-columns');
      await this.$store.dispatch('saveDB');
      if (this.$refs.checkbox.checked) {
        this.radioHandler();
      }
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
