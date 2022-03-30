<template>
  <p class="input-string">
    <b-input-group class="mb-2">
      <b-input-group-prepend class="hrip-input" is-text>
        <input
          ref="checkbox"
          type="checkbox"
          :checked="activeString === value.id"
          @click="radioHandler"
        />
      </b-input-group-prepend>
      <b-form-input
        v-model="data.name"
        class="hrip-input"
        @input="writeColumns"
      ></b-form-input>
      <b-form-input
        v-model="data.job"
        class="hrip-input"
        @input="writeColumns"
      ></b-form-input>
      <b-form-select
        v-if="Object.keys($store.state.vmixStore).length"
        v-model="data.photo"
        :options="$store.state.vmixStore.photo.values"
        class="select-photo"
        @change="writeColumns"
      ></b-form-select>
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
      data: this.value,
    };
  },
  methods: {
    radioHandler() {
      if (this.$refs.checkbox.checked) {
        const data = {
          text: `${this.data.name}#${this.data.job}`,
          photo: this.data.photo,
        };
        this.$emit('click', this.value.id);
        this.$emit('write-result', data);
      } else {
        const data = {
          text: '#',
          photo: '',
        };
        this.$emit('click', 'null');
        this.$emit('write-result', data);
      }
    },
    validate() {
      if (this.uppercase) {
        this.data.name = this.data.name.toUpperCase();
        this.data.job = this.data.job.toUpperCase();
      }
    },
    async writeColumns() {
      this.validate();
      this.$emit('input', this.data);
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
.hrip-input {
  height: 25px !important;
}

p,
.input-string,
.input-group {
  margin: 0 !important;
}

.select-photo {
  padding: 2px 28px 2px 12px !important;
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  height: 25px !important;
}

input {
  font-family: 'Montserrat', Verdana !important;
  font-size: 12px !important;
  padding: 2px 5px;
}

b-form-select {
  margin: 0 !important;
}
</style>
