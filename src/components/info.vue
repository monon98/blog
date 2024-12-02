<template>
  <div>
    <h1>Info</h1>
    <p>Vue version: {{ version }}</p>
    <p>User Agent: {{ userAgent }}</p>
    <p>platform: {{ platform }}</p>
    <p>onLine: {{ onLine }}</p>
    <p>是否手机设备: {{ mobile }}</p>
    <p>effectiveType: {{ effectiveType }}</p>
    <p>rtt: {{ rtt }}</p>
    <p>downlink: {{ downlink }}</p>
    <p>jsHeapSizeLimit: {{ jsHeapSizeLimit }}</p>
    <p>totalJSHeapSize: {{ totalJSHeapSize }}</p>
    <!-- <p>{{ info }}</p> -->
  </div>
</template>

<script setup lang="ts">
import {ref, version, onMounted } from "vue";

const userAgent = ref(navigator.userAgent)
const platform = ref(navigator.userAgentData.platform)
const mobile = ref(navigator.userAgentData.mobile)
const onLine = ref(navigator.onLine)
const effectiveType = ref(navigator.connection.effectiveType)
const rtt = ref(navigator.connection.rtt)
const downlink = ref(navigator.connection.downlink)
const jsHeapSizeLimit = ref(performance.memory.jsHeapSizeLimit)
const totalJSHeapSize = ref(performance.memory.totalJSHeapSize)
// const navigator = ref(navigator)
onMounted(() => {
    // navigator.userAgent
})
const info = ref('')

</script>

<style scoped>

</style>