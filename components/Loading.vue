<template>
  <div class="loading">
    <div class="bar" v-for="index in 3" :key="index"/>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loading {
  width: 30px;

  .bar {
    height: 5px;
    background-color: #000;
    animation: loading-animation .8s infinite;
    margin: 3px 0;
  }

  .bar:nth-child(2) {
    animation-delay: -.1s;
  }

  .bar:nth-child(1) {
    animation-delay: -.2s;
  }
}

@keyframes loading-animation {
  0%, 100% {
    margin-left: 10px;
    width: 10px;
  }

  50% {
    margin-left: 0;
    width: 30px;
  }
}
</style>
