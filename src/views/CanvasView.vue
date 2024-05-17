<script setup>
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import ControlPanel from "@/components/ThreeViewControlPanel.vue";
import RendererContent from "@/components/ThreeViewComponent.vue";
import { ref } from "vue";
import { Vector3 } from "three";

const rotation = ref(new Vector3());
const isRegular = ref(true);
const onUpdated = ref(false);
const vertices = ref([new Vector3(), new Vector3(), new Vector3(), new Vector3()]);
const additionalLinks = [{ path: "/solarsystem", text: "Solar System" }];

function typeChanged(type, newVertices) {
  isRegular.value = type;
  vertices.value = newVertices;
}

function onVerticesUpdated(newVertices) {
  console.log(vertices.value);
  onUpdated.value = true;
  vertices.value = newVertices;
}
</script>

<template>
  <PageTemplate :links="additionalLinks">
    <template v-slot:header>
      <PageHeader>
        Three-View &nbsp;[<small><i>Canvas</i></small
        >]
      </PageHeader>
    </template>
    <template v-slot:controls>
      <ControlPanel
        :vertices="vertices"
        :rotation="rotation"
        @vertices-updated="onVerticesUpdated"
        @tetra-type-changed="typeChanged"
      />
    </template>
    <template v-slot:content>
      <RendererContent
        v-model:rotation="rotation"
        :isRegular="isRegular"
        :onUpdated="onUpdated"
        :vertices="vertices"
        @update-done="onUpdated = false"
      />
    </template>
    <footer>
      <div class="footer-info">
        😁 Use Threejs <small><i>(based on WebGL)</i></small> and Vue
      </div>
    </footer>
  </PageTemplate>
</template>

<style scoped>
.right-pusher {
  margin-right: 4em;
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
</style>
