<script setup>
import { ref } from "vue";
defineProps(["keyword", "content", "required", "primitive"]);

const information = ref(null);
</script>

<template>
  <div class="input-wapper">
    <template v-if="primitive">
      <span :class="required ? 'required' : ''">{{ keyword + " : " }}</span>
      <input type="text" :value="content" @change="e => (value = e.target.value)" />
    </template>
    <template v-else>
      <span :class="required ? 'required' : ''">{{ keyword + " : " }} </span>
      <input type="checkbox" :checked="c" @change="e => (value = e.target.value)" />
      <div :class="c ? expand : ''">
        <input
          type="text"
          :value="content"
          @change="
            e => {
              information = e.target.value;
            }
          "
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
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
</style>
