---
hello: world
layout: doc
navbar: true
sidebar: false
---

<DrawCanvas :width="w" :height="h" backgroundColor="#ffffff" color="#000000" borderColor="red" />

<script setup>
import DrawCanvas from '@components/draw-canvas.vue';

const w = window.innerWidth * 0.6;
const h = 300;
</script>
