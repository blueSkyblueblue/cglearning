<script setup>
import ControlPanel from "@/components/ControlPanel.vue";
import RendererContent from "@/components/ThreeViewComponent.vue";
import { ref } from "vue";
import { Vector3 } from "three";
import { RouterLink } from "vue-router";

const position = ref(new Vector3(0, 0, 0));
const rotation = ref(new Vector3(0, 0, 0));

const isRegular = ref(true);
const vertices = ref(new Array());

function typeChanged(type, vertices) {
  console.log("changed", type, vertices);
  isRegular.value = type;
  vertices.value = vertices;
}
</script>

<template>
  <div class="background">
    <header>
      <nav><RouterLink to="/">Home</RouterLink></nav>
      <h1 id="title">
        Three-View &nbsp;[<small><i>Canvas</i></small
        >]
      </h1>
    </header>
    <main>
      <div class="main">
        <nav class="control-panel">
          <ControlPanel
            :position="position"
            :rotation="rotation"
            @tetra-type-changed="typeChanged"
          />
        </nav>
        <RendererContent
          v-model:position="position"
          v-model:rotation="rotation"
          :isRegular="isRegular"
          :vertices="vertices"
        />
      </div>
      <aside class="links">
        <RouterLink to="/solarsystem">Solar System</RouterLink>
      </aside>
    </main>
    <footer>
      <div class="footer-info">
        😁 Use Threejs <small><i>(based on WebGL)</i></small> and Vue
      </div>
    </footer>
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

header {
  height: 45px;
  background-color: rgb(55, 167, 55);
  display: flex;
  margin-bottom: 2em;
}

header nav {
  flex: initial;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5em;
  background-color: rgb(74, 173, 177);
}

nav a {
  color: rgb(32, 62, 137);
  font-weight: bolder;
  font-size: larger;
  font-family: Verdana, sans-serif;
  text-decoration: none;
  transition: transform 0.1s ease-in-out, color 0.2s ease-in-out;
}

nav a:hover {
  color: rgb(202, 42, 42);
  text-transform: uppercase;
  transform: rotate(-5deg);
}

#title {
  flex: auto;
  font-size: 20px;
  color: rgb(51, 47, 47);
  text-align: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial,
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
}

main .main {
  display: flex;
  column-gap: 20px;
}

.control-panel {
  width: 300px;
  height: calc(100vh - 120px);
  border-radius: 4px;
  background-color: rgb(158, 185, 223);
  overflow-y: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
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

.footer-info {
  position: absolute;
  width: 100%;
  bottom: 0.6em;
  margin-top: 10px;
  text-align: center;
  font-size: large;
  color: rgb(245, 142, 33);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

@media screen and (min-width: 1180px) {
  .links {
    display: block;
  }
}
</style>
