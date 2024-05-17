<script setup>
const props = defineProps(["info", "base", "hasRing", "hasLight"]);

function hexadecimal(value) {
  return "0x" + value.toString(16).toUpperCase().padStart(6, "0");
}
</script>

<template>
  <div class="form">
    <div class="plt-name">
      name: <span class="colored">{{ info.name }}</span>
    </div>
    <div class="message">
      <div class="base-obj">
        base: <strong>{{ base }}</strong>
      </div>
      <div class="options">
        <div>
          <label :for="info.name + '_ring'">has ring: </label>
          <input :id="info.name + '_ring'" type="checkbox" :checked="hasRing" disabled />
        </div>
        <div>
          <label :for="info.name + '_light'">has light: </label>
          <input :id="info.name + '_light'" type="checkbox" :checked="hasLight" disabled />
        </div>
      </div>
      <div class="properties">
        <div>radius: {{ info.radius }}</div>
        <div v-if="info.segments">segments: {{ info.segments }}</div>
        <div>distance: {{ info.distance }}</div>
        <div>rotation speed: {{ info.rotateSpeed }}</div>
        <div>self rotation speed: {{ info.selfRotateSpeed }}</div>
        <div v-if="info.texture">texture: {{ info.texture }}</div>
        <div v-else>color: {{ info.color }}</div>
        <div v-if="hasLight">
          light: &nbsp;{
          <div class="indent">
            <div>color : {{ hexadecimal(info.light.color) }}</div>
            <div>intensity : {{ info.light.intensity }}</div>
          </div>
          }
        </div>
        <div v-if="hasRing">
          ring:
          <div v-for="(item, key) in info.ring">{{ key }} : {{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form {
  border-radius: 4px;
  margin: 0 0.5em;
  background: rgb(61, 119, 169);
}

.plt-name {
  padding: 0;
  text-align: center;
  font-size: large;
  background-color: rgb(68, 195, 79);
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

div input {
  margin-left: 0.3em;
  width: 0.9em;
  height: 0.9em;
  vertical-align: -0.14em;
}

.indent {
  margin-left: 1.2em;
}
</style>
