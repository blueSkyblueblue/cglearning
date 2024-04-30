<script setup>
import ControlPanel from "@/components/ControlPanel.vue";
import RendererContent from "@/components/RendererContent.vue";
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
  <main>
    <nav class="left navigation-container">
      <ControlPanel
        :position="position"
        :rotation="rotation"
        @tetra-type-changed="typeChanged"
      />
    </nav>
    <div class="renderer-target-container">
      <h1 id="title">
        Three-View &nbsp;[<small><i>Canvas</i></small
        >]
      </h1>
      <RendererContent
        class="decoration"
        v-model:position="position"
        v-model:rotation="rotation"
        :isRegular="isRegular"
        :vertices="vertices"
      />
    </div>
    <aside class="right navigation-container information">
      <RouterLink to="/solarsystem">Solar System</RouterLink>
    </aside>
  </main>
  <footer>
    <div class="websize-info">
      Use Threejs <small><i>(based on WebGL)</i></small> and Vue
    </div>
  </footer>
</template>

<style scoped>
main {
  margin-top: 20px;
  display: flex;
}

#title {
  background-color: rgb(236, 217, 255);
  border-radius: 3px;
  margin: 0 30px;
  margin-bottom: 20px;
  padding: 4px;
  font-size: 20px;
  color: rgb(51, 47, 47);
  text-align: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}

.navigation-container {
  background-color: rgb(173, 234, 186);
  border-radius: 4px;
}

.left {
  width: 300px;
}

.right {
  display: none;
  width: 200px;
}

.renderer-target-container {
  flex: auto;
}

.decoration {
  border-left: 8px solid rgb(150, 135, 135);
  border-right: 8px solid rgb(150, 135, 135);
  border-radius: 4px;
  padding: 0 50px;
}

.websize-info {
  position: absolute;
  width: 100%;
  bottom: 1em;
  margin-top: 10px;
  text-align: center;
  font-size: large;
  color: rgb(245, 142, 33);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.websize-info::before {
  content: "😁";
}

@media screen and (max-width: 1000px) {
  .left {
    display: none;
  }

  .right {
    display: none;
  }
}

@media screen and (min-width: 1180px) {
  .right {
    display: block;
  }
}

@media screen and (min-width: 1180px) and (max-width: 1200px) {
  .decoration {
    border-radius: 0;
    padding: 0;
  }
}
</style>
