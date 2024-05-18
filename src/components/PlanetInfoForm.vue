<script setup>
import { ref } from "vue";

const props = defineProps(["info", "base", "hasRing", "hasLight"]);
const emit = defineEmits(["remove", "comfirm"]);

const n_base = ref(props.base);
const n_hasring = ref(props.hasRing);
const n_haslight = ref(props.hasLight);
const n_info = ref({
  radius: props.info.radius,
  distance: props.info.distance,
  segments: props.info.segments[0] + ", " + props.info.segments[1],
  rotateSpeed: props.info.rotateSpeed,
  selfRotateSpeed: props.info.selfRotateSpeed,
});

function hexadecimal(value) {
  return "0x" + value.toString(16).toUpperCase().padStart(6, "0");
}

function segmentsStringToArray() {
  return n_info.value.segments.split(",").map(item => parseInt(item));
}

function combine() {
  const temp = n_info.value;
  return [
    {
      radius: temp.radius,
      segments: segmentsStringToArray(temp.segments),
      distance: temp.distance,
      rotateSpeed: temp.rotateSpeed,
      selfRotateSpeed: temp.selfRotateSpeed,
      texture: "textures/sun.jpg",
      light: { color: 0xffffff, intensity: 15000 },
      name: props.info.name,
    },
    n_base.value,
    n_hasring.value,
    n_haslight.value,
  ];
}

function remove() {
  emit("remove", props.info.name);
}

function comfirm() {
  emit("comfirm", combine());
}
</script>

<template>
  <div class="form">
    <div class="plt-name">
      name: <span class="colored">{{ info.name }}</span>
      <span class="icon" @click="remove"></span>
    </div>
    <div class="message">
      <div class="base-obj flex">
        <label :for="info.name">base: </label>
        <input v-model="n_base" :id="info.name" type="text" />
      </div>
      <div class="options">
        <div class="flex">
          <label :for="info.name + '-ring'">has ring: </label>
          <input v-model.boolean="n_hasring" :id="info.name + '-ring'" type="checkbox" />
        </div>
        <div class="flex">
          <label :for="info.name + '-light'">has light: </label>
          <input v-model.boolean="n_haslight" :id="info.name + '-light'" type="checkbox" />
        </div>
      </div>
      <div class="properties">
        <div class="flex">
          <label :for="info.name + '-radius'">radius: </label>
          <input
            v-model.number="n_info.radius"
            :id="info.name + '-radius'"
            type="number"
            step="0.1"
          />
        </div>
        <div class="flex" v-if="info.segments">
          <label :for="info.name + '-seg'">segments: </label>
          <input v-model="n_info.segments" :id="info.name + '-seg'" type="text" />
        </div>
        <div class="flex">
          <label :for="info.name + '-dis'">distance: </label>
          <input
            v-model.number="n_info.distance"
            :id="info.name + '-dis'"
            type="number"
            step="0.1"
          />
        </div>
        <div class="flex">
          <label :for="info.name + '-rot'">rotation speed: </label>
          <input
            v-model.number="n_info.rotateSpeed"
            :id="info.name + '-rot'"
            type="number"
            step="0.1"
          />
        </div>
        <div class="flex">
          <label :for="info.name + '-srot'">self rotation speed: </label>
          <input
            v-model.number="n_info.selfRotateSpeed"
            :id="info.name + '-srot'"
            type="number"
            step="0.1"
          />
        </div>
        <div v-if="info.texture">texture: {{ info.texture }}</div>
        <div v-else class="flex">color: {{ info.color }}</div>
        <div v-if="hasLight">
          light: &nbsp;{
          <div class="indent">
            <div>color : {{ hexadecimal(info.light.color) }}</div>
            <div>intensity : {{ info.light.intensity }}</div>
          </div>
          }
        </div>
        <div v-if="hasRing">
          ring: &nbsp;
          <div class="indent">
            <div v-for="(item, key) in info.ring">{{ key }} : {{ item }}</div>
          </div>
        </div>
      </div>
    </div>
    <button @click="comfirm" class="comfirm-btn">comfirm</button>
  </div>
  <div class="seperator"></div>
</template>

<style scoped>
.seperator {
  height: 1.4em;
}

.flex {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

label {
  text-wrap: nowrap;
}

input,
input::placeholder {
  max-width: 40%;
  font-style: italic;
  outline: none;
  height: 1.2em;
  border: none;
  color: rgb(17, 69, 67);
  caret-color: rgb(200, 157, 27);
  background-color: rgb(61, 119, 169);
}

input {
  autocomplete: false;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.form {
  border-radius: 4px;
  margin: 0 0.5em;
  background: rgb(61, 119, 169);
}

.plt-name {
  position: relative;
  padding: 0;
  text-align: center;
  font-size: large;
  background-color: rgb(68, 195, 79);
}

.icon {
  position: absolute;
  right: 0;
  width: 10px;
  height: 100%;
  background-color: red;
  transition: width 0.2s ease-in-out;
}

.icon:hover {
  width: 50px;
}

.icon:hover::before {
  display: inline-block;
  content: "remove";
  color: white;
  font-size: small;
  transform: translateY(-18%);
}

.icon:active {
  background-color: rgb(255, 140, 0);
}

.colored {
  font-weight: bolder;
  color: rgb(207, 40, 143);
}

.message {
  padding-left: 1.2em;
}

.message * {
  font-size: 17px;
  font-weight: 500;
}

.base-obj strong {
  font-style: italic;
  color: rgb(74, 231, 234);
}

.message > .options {
  display: flex;
  justify-content: flex-start;
}

.options div {
  width: 50%;
}

.options input {
  margin-left: 0.3em;
  margin-top: 0.2em;
  width: 0.9em;
  height: 0.9em;
}

.indent {
  margin-left: 1.2em;
}

.comfirm-btn {
  display: block;
  margin: auto;
  width: 100%;
  height: 2em;
  border-radius: 1px;
  border: none;
  color: rgb(158, 237, 46);
  text-transform: capitalize;
  font-weight: bold;
  letter-spacing: 0.07em;
  background-color: rgb(43, 78, 109);
}

.comfirm-btn:hover {
  transition: height 0.15s ease-in;
  height: 2.5em;
  color: color-mix(in srgb, rgb(158, 237, 46) 50%, rgb(255, 0, 0));
  background-color: color-mix(in srgb, rgb(43, 78, 109) 80%, rgb(43, 215, 238));
}

.comfirm-btn:active {
  background-color: rgb(43, 78, 109);
}
</style>
