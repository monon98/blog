---
hello: world
layout: doc
navbar: true
sidebar: false
---

1. [snowflakes](./snowflakes) 雪花飘落

<Snowflakes :width="500" :height="100" :count="50" x="center" color="skyblue" :maxSpeed="1" />

2. random scrolling 滚动字符

<RandomScroll :immediate="true" />
<RandomScroll :immediate="false" />

<script setup>
import Snowflakes from '@components/snowflakes.vue'
import RandomScroll from '@components/random-scroll.vue'
</script>
