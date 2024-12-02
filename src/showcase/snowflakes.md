---
hello: world
layout: page
navbar: false
sidebar: false
---

<Snowflakes :width="0" :height="0" count="200" x="end" color="skyblue" maxSpeed="10" />

<script setup>
import Snowflakes from '@components/snowflakes.vue'
</script>