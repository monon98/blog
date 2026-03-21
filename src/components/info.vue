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

const isBrowser = typeof window !== 'undefined';

const userAgent = ref(isBrowser ? navigator.userAgent : 'Server');
const platform = ref(isBrowser && navigator.userAgentData ? navigator.userAgentData.platform : 'Server');
const mobile = ref(isBrowser && navigator.userAgentData ? navigator.userAgentData.mobile : false);
const onLine = ref(isBrowser ? navigator.onLine : true);
const effectiveType = ref(isBrowser && navigator.connection ? navigator.connection.effectiveType : '4g');
const rtt = ref(isBrowser && navigator.connection ? navigator.connection.rtt : 0);
const downlink = ref(isBrowser && navigator.connection ? navigator.connection.downlink : 0);
const jsHeapSizeLimit = ref(isBrowser && performance && performance.memory ? performance.memory.jsHeapSizeLimit : 0);
const totalJSHeapSize = ref(isBrowser && performance && performance.memory ? performance.memory.totalJSHeapSize : 0);

const info = ref('');

</script>

<style scoped>

</style>