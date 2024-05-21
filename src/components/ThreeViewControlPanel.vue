<script setup>
import { Vector3 } from "three";
import { ref } from "vue";

const props = defineProps({ vertices: Array, rotation: Vector3 });
const emit = defineEmits(["tetra-type-changed", "vertices-updated"]);
const isRegular = ref(true);
const vertices = [
  new Vector3(-2, -1, 0),
  new Vector3(2, -1, 0),
  new Vector3(0, 1, 2),
  new Vector3(0, 1, -2),
];

function toggleType() {
  isRegular.value = !isRegular.value;
  emit("tetra-type-changed", isRegular.value, vertices);
}

function updateVertices() {
  const verticesList = document.getElementsByClassName("vertex-item");
  for (let i = 0; i < vertices.length; i++) {
    const vertexValues = verticesList[i].getElementsByTagName("input");
    vertices[i].x = vertexValues[0].value;
    vertices[i].y = vertexValues[1].value;
    vertices[i].z = vertexValues[2].value;
  }

  emit("vertices-updated", vertices);
}

function radToDeg(radian) {
  return ((radian * 180) / Math.PI).toFixed(6);
}
</script>

<template>
  <div class="wapper">
    <h3>Control Panel</h3>
    <div class="section">
      <div class="item-header">Tetrahedron Type:</div>
      <div class="buttons">
        <div class="radio-button">
          <input type="radio" id="regular-type" @change="toggleType" :checked="isRegular" />
          <label for="regular-type">Regular</label>
        </div>
        <div class="radio-button">
          <input type="radio" id="normal-type" @change="toggleType" :checked="!isRegular" />
          <label for="normal-type">Custom</label>
        </div>
      </div>
    </div>
    <!-- <hr /> -->
    <div id="vertices" :class="isRegular ? 'close-vertices-panel' : ''">
      <div class="vertices-header">Setup the Vertices' Position</div>
      <ul>
        <li class="vertex-item" v-for="(item, index) in vertices">
          <span class="vertex-prefix"> {{ ["A", "B", "C", "D"][index] }} : </span>
          <div class="vertex-value">
            <div v-for="(subitem, i) in item">
              <label :for="'vertices_' + index + '_' + i"> {{ ["x", "y", "z"][i] }} :</label>
              <input
                type="number"
                :id="'vertices_' + index + '_' + i"
                step="0.1"
                :value="subitem"
              />
            </div>
          </div>
        </li>
      </ul>

      <button type="button" @click="updateVertices">commit</button>
    </div>

    <!-- <hr /> -->
    <div class="section rotation-panel">
      <div class="item-header">Rotation in degree: <em>(read only)</em></div>
      <div><span>x:</span> <input type="number" :value="radToDeg(rotation.x)" disabled /></div>
      <div><span>y:</span> <input type="number" :value="radToDeg(rotation.y)" disabled /></div>
      <div><span>z:</span> <input type="number" :value="radToDeg(rotation.z)" disabled /></div>
    </div>
    <hr />

    <div class="bottom-padding"></div>
  </div>
</template>

<style scoped>
.wapper {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

h3 {
  text-align: center;
  font-size: 20px;
  margin-top: 0.4em;
  margin-bottom: 0.6em;
  font-weight: bold;
}

.section {
  padding: 10px 20px 20px;
}

.item-header {
  font-size: 16px;
  color: rgb(112, 69, 12);
  margin-bottom: 10px;
}

.buttons {
  width: 100%;
  height: 2em;
  display: flex;
  justify-content: space-around;
}

.radio-button {
  position: relative;
  width: 40%;
  display: inline-block;
}

.radio-button > input {
  position: absolute;
  height: 100%;
  margin-left: 8px;
  display: inline-block;
}

.radio-button > label {
  border-radius: 4px;
  display: inline-block;
  height: 100%;
  width: 100%;
  line-height: 200%;
  text-align: center;
  background-color: rgb(71, 152, 206);
  background-color: rgb(223, 178, 139);
}

.radio-button > input:hover,
.radio-button > input:hover + label,
.radio-button > label:hover {
  color: rgb(247, 105, 255);
  cursor: pointer;
  background-color: rgb(238, 219, 201);
}

#vertices {
  display: block;
  background-color: rgb(84, 124, 159);
  border-radius: 3px;
  margin: 0 5px;
  overflow-y: hidden;
  max-height: 1500px;
  transition: max-height 0.5s ease-in-out;
}

#vertices.close-vertices-panel {
  max-height: 0;
}

.vertices-header {
  color: white;
  padding: 5px 0;
  text-align: center;
}

#vertices > ul {
  padding: 0;
  list-style: none;
}

.vertex-prefix {
  font-weight: bolder;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  background-color: rgb(133, 144, 140);
}

.vertex-value label {
  display: inline-block;
  width: 2.4em;
  text-align: center;
  font-size: larger;
  font-weight: bold;
}

.vertex-value input {
  padding: 0.3em 0.6em;
  outline: none;
  border: none;
  background-color: rgb(213, 213, 213);
}

.vertex-item {
  display: flex;
  background-color: rgb(177, 190, 185);
}

.vertex-item:nth-of-type(even) {
  background-color: rgb(192, 189, 199);
}

.vertex-item:nth-of-type(odd) > .vertex-prefix {
  background-color: color-mix(in srgb, rgb(82, 119, 107) 85%, white);
}

#vertices > button {
  display: block;
  margin: 10px auto;
  outline: none;
  padding: 0.5em 1.5em;
}

.rotation-panel > div > span {
  display: inline-block;
  width: 1.2em;
  font-weight: bold;
}

.bottom-padding {
  height: 300px;
}
</style>
