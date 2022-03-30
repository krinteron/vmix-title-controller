<template>
  <p class="input-string">
    <b-input-group class="mb-2">
      <b-input-group-prepend class="quad-input" is-text>
        <input
          ref="checkbox"
          :checked="activeString === value.id"
          type="checkbox"
          @click="radioHandler"
        />
      </b-input-group-prepend>
      <b-form-input
        v-model="text.firstname"
        class="quad-input"
        @input="writeColumns"
      ></b-form-input>
      <b-form-input
        v-model="text.lastname"
        class="quad-input"
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
    activeString: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
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
        const text = `${this.text.firstname}#${this.text.lastname}`;
        this.$emit('click', this.value.id);
        this.$emit('write-result', text);
      } else {
        this.$emit('click', 'null');
        this.$emit('write-result', '#');
      }
    },
    validate() {
      if (this.uppercase) {
        this.text.firstname = this.text.firstname.toUpperCase();
        this.text.lastname = this.text.lastname.toUpperCase();
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
p,
.input-string,
.input-group {
  margin: 0 !important;
}
.quad-input {
  height: 25px !important;
}
input {
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  padding: 2px 5px;
}
</style>
