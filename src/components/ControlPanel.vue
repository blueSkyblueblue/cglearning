<script setup>
import { Vector3 } from "three";
import { ref, watch } from "vue";

const isRegular = ref(true);

function toggleType() {
  isRegular.value = !isRegular.value;
}

defineProps({
  position: Vector3,
  rotation: Vector3,
});

const vertices = [
  new Vector3(-2, -1, 0),
  new Vector3(2, -1, 0),
  new Vector3(0, 1, 2),
  new Vector3(0, 1, -2),
];

const emit = defineEmits(["tetra-type-changed"]);
watch(isRegular, async (current, previous) => {
  alert(current);
  emit("tetra-type-changed", current, vertices);
});
</script>

<template>
  <h3>Control Panel</h3>
  <div class="tetrahedron-type">
    <div class="item-header">Tetrahedron Type:</div>
    <div class="radio-button">
      <input
        type="radio"
        name="tetrahedron-type"
        id="regular-type"
        @change="toggleType"
        :checked="isRegular"
      />
      <label for="regular-type">Regular</label>
    </div>
    <div class="radio-button">
      <input
        type="radio"
        name="tetrahedron-type"
        id="normal-type"
        @change="toggleType"
        :checked="!isRegular"
      />
      <label for="normal-type">Custom</label>
    </div>
  </div>
  <hr />
  <div class="orientation">
    <div>Object Rotation:</div>
    <div>x: <input type="number" :value="rotation.x" step="0.1" disabled /></div>
    <div>y: <input type="number" :value="rotation.y" step="0.1" disabled /></div>
    <div>z: <input type="number" :value="rotation.z" step="0.1" disabled /></div>
  </div>
  <hr />
  <div class="vertices">
    <div>Setup Vetices</div>
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
}

.item-header {
  font-size: large;
  color: rgb(112, 69, 12);
}

.radio-button {
  display: inline-block;
  padding: 5px;
  padding-right: 30px;
  margin-right: 10px;
  margin-top: 10px;
  background-color: rgb(223, 178, 139);
  border-radius: 2px;
}

.radio-button:hover {
  background-color: rgb(238, 219, 201);
  color: rgb(247, 105, 255);
}

.radio-button > input[type="radio"] {
  margin-right: 8px;
}

.tetrahedron-type {
  padding: 20px;

  /* testing */
  border: 1px solid black;
}

.orientation {
  padding: 20px;
  border: 1px solid black;
}
</style>
