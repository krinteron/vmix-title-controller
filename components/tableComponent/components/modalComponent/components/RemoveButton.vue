<template>
  <div class="config-remove-btn-wrapper">
    <div class="config-remove-btn" @click="$emit('click-event')">
      <div class="cros-line-1"></div>
      <div class="cros-line-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['click-event'],
};
</script>

<style scoped>
.config-remove-btn-wrapper {
  text-align: right;
}

.config-remove-btn {
  position: relative;
  display: inline-block;
  height: 20px;
}

.config-remove-btn:hover div {
  background: #d00;
  transition: 0.2s;
}

.cros-line-1 {
  position: relative;
  width: 20px;
  height: 6px;
  top: 30%;
  background: rgb(214, 212, 212);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.cros-line-2 {
  position: relative;
  width: 20px;
  height: 6px;
  background: rgb(214, 212, 212);
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}
</style>
