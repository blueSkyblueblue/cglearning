<script setup>
import { reactive, ref } from "vue";
import InputTemplate from "./js/InputTemplate.js";

const props = defineProps(["info"]);
const emit = defineEmits(["remove", "comfirm"]);

console.log(props.info);
const temp = reactive(new InputTemplate().from(props.info));
const hasLight = ref(false);
const hasRing = ref(false);
const useTexture = reactive({ planet: false, ring: false });

useTexture.planet = temp.texture ? true : false;
useTexture.ring = temp.ring?.texture ? true : false;

hasLight.value = temp.light ? true : false;
hasRing.value = temp.ring ? true : false;

function comfirm() {
  if (!temp.isValid()) return;
  emit("comfirm", temp.generate(useTexture, hasLight, hasRing));
}

function toggleLight() {
  if (hasLight.value) {
    hasLight.value = false;
    temp.light = null;
  } else {
    hasLight.value = true;
    temp.light = {};
  }
}

function toggleRing() {
  if (hasRing.value) {
    hasRing.value = false;
    temp.ring = null;
  } else {
    hasRing.value = true;
    temp.ring = {};
  }
}

function colorToString(color) {
  if (color && typeof color === "number") return "0x" + color.toString(16).padStart(6, 0);
  return "";
}

function updateSegments(e) {
  const info = e.target.value.trim();
  if (e || e === "initial" || e === "unset") temp.segments = null;
  else {
    temp.segments = info.split(",").map(item => parseInt(item));
  }
}

function segmentsInfo() {
  if (temp.segments) return `[${temp.segments[0]}, ${temp.segments[1]}]`;
  else return "";
}
</script>

<template>
  <div class="form">
    <div class="plt-name">
      Name: <span class="colored">{{ temp.name }}</span>
      <span class="icon" @click="$emit('remove', temp.name)"></span>
    </div>
    <div class="message">
      <div class="input-wapper">
        <span class="required">radius : </span>
        <input
          type="text"
          :value="temp.radius"
          @change="e => (temp.radius = parseFloat(e.target.value))"
        />
      </div>
      <div class="input-wapper">
        <span class="required">base : </span>
        <input type="text" :value="temp.base" @change="e => (temp.base = e.target.value.trim())" />
      </div>
      <div class="input-wapper">
        <span class="required">distance : </span>
        <input
          type="text"
          :value="temp.distance"
          @change="e => (temp.distance = parseFloat(e.target.value))"
        />
      </div>
      <div class="input-wapper">
        <template v-if="useTexture.planet">
          <span class="required"
            >texture
            <span class="color-control" @click="useTexture.planet = !useTexture.planet"
              >[/color]</span
            >
            :
          </span>
          <input
            type="text"
            :value="temp.texture"
            @change="e => (temp.texture = e.target.value.trim())"
          />
        </template>
        <template v-else>
          <span class="required"
            >color
            <span class="color-control" @click="useTexture.planet = !useTexture.planet"
              >[/texture]</span
            >
            :
          </span>
          <input
            type="text"
            :value="colorToString(temp.color)"
            @change="e => (temp.color = parseInt(e.target.value, 16))"
          />
        </template>
      </div>
      <div class="input-wapper">
        <span>rotationSpeed : </span>
        <input
          type="text"
          :value="temp.rotationSpeed"
          @change="e => (temp.rotationSpeed = parseFloat(e.target.value))"
        />
      </div>
      <div class="input-wapper">
        <span>revolutionSpeed : </span>
        <input
          type="text"
          :value="temp.revolutionSpeed"
          @change="e => (temp.revolutionSpeed = parseFloat(e.target.value))"
        />
      </div>
      <div class="input-wapper">
        <span>has light : </span>
        <input type="checkbox" :checked="hasLight" @change="toggleLight" />
      </div>
      <div class="indented" ref="lightPanel" :class="hasLight ? 'expand' : ''">
        <div class="input-wapper">
          <span class="required">color : </span>
          <input
            type="text"
            :value="colorToString(temp.light?.color)"
            @change="e => (temp.light.color = parseInt(e.target.value, 16))"
          />
        </div>
        <div class="input-wapper">
          <span class="required">intensity : </span>
          <input
            type="text"
            :value="temp.light?.intensity"
            @change="e => (temp.light.intensity = parseFloat(e.target.value))"
          />
        </div>
      </div>
      <div class="input-wapper">
        <span>has ring : </span>
        <input type="checkbox" :checked="hasRing" @change="toggleRing" />
      </div>
      <div class="indented" :class="hasRing ? 'expand' : ''">
        <div class="input-wapper">
          <span class="required">innerRadius : </span>
          <input
            type="text"
            :value="temp.ring?.innerRadius || ''"
            @change="e => (temp.ring.innerRadius = parseFloat(e.target.value))"
          />
        </div>
        <div class="input-wapper">
          <span class="required">outerRadius : </span>
          <input
            type="text"
            :value="temp.ring?.outerRadius || ''"
            @change="e => (temp.ring.outerRadius = parseFloat(e.target.value))"
          />
        </div>
        <div class="input-wapper">
          <template v-if="useTexture.ring">
            <span class="required"
              >texture
              <span class="color-control" @click="useTexture.ring = !useTexture.ring"
                >[/color]</span
              >
              :
            </span>
            <input
              type="text"
              :value="temp.ring?.texture || ''"
              @change="e => (temp.ring.texture = e.target.value.trim())"
            />
          </template>
          <template v-else>
            <span class="required"
              >color
              <span class="color-control" @click="useTexture.ring = !useTexture.ring"
                >[/texture]</span
              >
              :
            </span>
            <input
              type="text"
              :value="colorToString(temp.ring?.color)"
              @change="e => (temp.ring.color = parseInt(e.target.value, 16))"
            />
          </template>
        </div>
      </div>
      <div class="input-wapper">
        <span>segments : </span>
        <input type="text" :value="segmentsInfo()" @change="updateSegments($event)" />
      </div>

      <!-- <PlanetInfoForm
        keyword="base"
        content=""
        required
        @update="e => console.log(e)"
      ></PlanetInfoForm>
      <PlanetInfoForm keyword="distance"></PlanetInfoForm>
      <PlanetInfoForm keyword="radius"></PlanetInfoForm>
      <PlanetInfoForm keyword="color"></PlanetInfoForm>
      <PlanetInfoForm keyword="texture"></PlanetInfoForm>
      <PlanetInfoForm keyword="rotationSpeed"></PlanetInfoForm>
      <PlanetInfoForm keyword="revolutionSpeed"></PlanetInfoForm>
      <PlanetInfoForm keyword="light"></PlanetInfoForm>
      <PlanetInfoForm keyword="ring"></PlanetInfoForm>
      <PlanetInfoForm keyword="segments"></PlanetInfoForm>

      <div v-for="[key, value] in Object.entries(temp).filter(([key]) => key !== 'name')">
        <div class="input-wapper">
          <span :class="InputTemplate.s_NeededProps.includes(key) ? 'required' : ''"
            >{{ key + " : " }}
          </span>
          <input
            v-if="typeof value !== 'object'"
            type="text"
            :value="`${value}`"
            @change="e => (value = e.target.value)"
          />
          <div v-else>
            <input
              type="text"
              :value="`(${value}`"
              @change="
                e => {
                  value = e.target.value;
                }
              "
            />
          </div>
        </div> 
      </div> -->
      <div style="height: 40px"></div>
    </div>
    <button @click="comfirm" class="comfirm-btn">comfirm</button>
  </div>

  <div class="seperator"></div>
</template>

<style scoped>
.seperator {
  height: 1.4em;
}

.indented {
  text-indent: 2em;
  max-height: 0;
  transition: max-height 0.1s ease-in-out;
  overflow: hidden;
}

span.color-control {
  font-size: 10px;
}

span.color-control:hover {
  cursor: pointer;
  color: rgb(255, 78, 78);
}

span.color-control:active {
  color: rgb(78, 255, 47);
}

.expand {
  max-height: 500px;
}

.message {
  padding-left: 1.2em;
}

.message * {
  font-size: 17px;
  font-weight: 500;
}

.input-wapper {
  display: flex;
  flex-direction: row;
}

.input-wapper span {
  flex: none;
}

.required::before {
  content: "*";
  color: red;
  font-size: small;
  vertical-align: top;
  margin-left: -5.5px;
}

input,
input::placeholder {
  width: 100%;
  height: 100%;
  font-style: italic;
  outline: none;
  border: none;
  color: rgb(17, 69, 67);
  caret-color: rgb(200, 157, 27);
  background-color: rgb(61, 119, 169);
  transform: translateY(1px);
}

input[type="checkbox"] {
  width: initial;
  margin-left: 0.5em;
  align-self: center;
  transform: translateY(1.5px);
}

.form {
  border-radius: 4px;
  width: 95%;
  margin: 0 auto;
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
