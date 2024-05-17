<script setup>
import { RouterLink } from "vue-router";

defineProps({ links: Array });
</script>

<template>
  <div class="background">
    <slot name="header"></slot>
    <main>
      <div class="main">
        <nav class="control-panel">
          <slot name="controls"></slot>
        </nav>
        <section class="main-content">
          <slot name="content"></slot>
        </section>
      </div>
      <aside class="links">
        <RouterLink :to="link.path" v-for="link in links"> {{ link.text }} </RouterLink>
      </aside>
    </main>
    <slot></slot>
  </div>
</template>

<style scoped>
.background {
  width: 100%;
  height: 100vh;
  overflow: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  position: relative;
  top: 0;
  left: 0;
  background-image: linear-gradient(to bottom, rgb(214, 214, 255), rgb(132, 156, 255));
}

main {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
}

main .main {
  flex: auto;
  display: flex;
  column-gap: 20px;
}

.control-panel {
  position: relative;
  flex: initial;
  width: 300px;
  height: calc(100vh - 120px);
  border-radius: 4px;
  background-color: rgb(158, 185, 223);
  overflow-y: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

.main-content {
  flex: auto;
}

.links {
  display: none;
  width: 150px;
  border-left: 2px solid brown;
  text-align: center;
}

.links a {
  display: inline-block;
  color: rgb(177, 43, 226);
  font-size: larger;
  text-decoration: none;
}

.links a::after {
  content: "";
  width: 0;
  display: block;
  transition: width 0.3s ease-in-out;
}

.links a:hover::after {
  border: 1px solid brown;
  width: 100%;
}

@media screen and (min-width: 1180px) {
  .links {
    display: block;
  }
}
</style>
