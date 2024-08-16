<template>
  <div class="flex flex-col min-h-screen">
    <headerapp />
    <main class="flex-grow">
      <logoClouds />
      <mainapp />
    </main>
  </div>
</template>

<script>
import headerapp from "@/components/headerapp.vue";
import mainapp from "@/components/main.vue";
import logoClouds from "@/components/logoClouds.vue";

export default {
  components: {
    headerapp,
    mainapp,
    logoClouds,
  },
};
</script>

<style>
/* Global styles can be added here if needed */
</style>