<script setup>
defineProps(["to"]);
</script>

<template>
  <RouterLink class="bottom-link" :to="to">
    <span><slot></slot></span>
  </RouterLink>
</template>

<style scoped>
.bottom-link {
  display: block;
  width: 100%;
  height: 3em;
  line-height: 3em;
  text-align: center;
  text-decoration: none;
  color: rgb(7, 71, 50);
  position: absolute;
  bottom: 0;
  border-radius: 3px;
  background-color: rgb(181, 84, 32);
  transition: background-color 0.02s ease-in-out;
}

.bottom-link span {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
}

.bottom-link:hover {
  color: rgb(17, 112, 80);
  background: linear-gradient(to right, hsl(33, 100%, 62%), rgb(43, 214, 46));
  background-size: 500%;
  animation-name: wave;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}

.bottom-link:hover span {
  animation-name: slide-text;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}

@keyframes wave {
  0% {
    background-size: 800%;
    background-position: 0 0;
  }

  33% {
    background-size: 500%;
    background-position: 75% 25%;
  }

  66% {
    background-size: 700%;
    background-position: 25% 75%;
  }

  100% {
    background-size: 900%;
    background-position: 100% 100%;
  }
}

@keyframes slide-text {
  30% {
    transform: translate(-0.5em);
  }

  70% {
    transform: translate(0.5em);
  }
}
</style>
