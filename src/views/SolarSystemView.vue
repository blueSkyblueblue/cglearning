<script setup>
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import PlanetsSpace from "@/components/PlanetsSpace.vue";
// import SolarSystem from "@/components/SolarSystem.vue";
import SolarSystemControlPanel from "@/components/SolarSystemControlPanel.vue";
import planetsInformation from "@/components/js/PlanetsInformation.js";
import { ref } from "vue";

const additionalLinks = [{ path: "/three-view", text: "Three View" }];
const size = ref({ width: 100, height: 100 });
const config = ref({ orbit: false, fixedCamera: false });

function recalcSize() {
  let width = window.innerWidth - 370;
  if (window.innerWidth > 1180) width -= 150;
  let height = window.innerHeight - 120;
  if (width < 0) width = 0;
  if (height <= 0) height = 1;
  size.value.width = width;
  size.value.height = height;

  console.log(size.value);
}

recalcSize();
window.addEventListener("resize", recalcSize);
</script>

<template>
  <PageTemplate class="background" :links="additionalLinks">
    <template v-slot:header>
      <PageHeader>Solar System Travel</PageHeader>
    </template>
    <template v-slot:controls>
      <SolarSystemControlPanel
        :setting="config"
        @setting-change="key => (config[key] = !config[key])"
      />
    </template>
    <template v-slot:content>
      <PlanetsSpace :config="config" :size="size" />
      <!-- :planets="planetsInformation"  -->
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
