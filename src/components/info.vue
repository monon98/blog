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
import { computed, ref, version } from "vue";

// 统一的浏览器环境检测
const isBrowser = computed(() => typeof window !== 'undefined');

// 统一的浏览器 API 访问函数
const getBrowserInfo = <T>(getter: () => T, fallback: T): T => {
  return isBrowser.value ? getter() : fallback;
};

// 使用 computed 替代 ref，避免不必要的响应式开销
const userAgent = computed(() => getBrowserInfo(() => navigator.userAgent, 'Server'));
const platform = computed(() => getBrowserInfo(() => navigator.userAgentData?.platform, 'Server'));
const mobile = computed(() => getBrowserInfo(() => navigator.userAgentData?.mobile, false));
const onLine = computed(() => getBrowserInfo(() => navigator.onLine, true));
const effectiveType = computed(() => getBrowserInfo(() => navigator.connection?.effectiveType, '4g'));
const rtt = computed(() => getBrowserInfo(() => navigator.connection?.rtt, 0));
const downlink = computed(() => getBrowserInfo(() => navigator.connection?.downlink, 0));
const jsHeapSizeLimit = computed(() => getBrowserInfo(() => performance?.memory?.jsHeapSizeLimit, 0));
const totalJSHeapSize = computed(() => getBrowserInfo(() => performance?.memory?.totalJSHeapSize, 0));

const info = ref('');

</script>

<style scoped>

</style>