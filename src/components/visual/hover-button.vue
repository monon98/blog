<template>
  <button class="button">
    <!-- <span v-html="icon"></span> -->
    <svg v-html="icon" :width="width" :height="height" :color="iconColor"></svg>
    <span class="text-button">{{ text }}</span>
  </button>
</template>
<script setup>
import { onMounted, ref, reactive, watch, computed} from 'vue'

const { text, icon, iconType, width, height, iconColor, color, ...props} = defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconType: {
    type: String,
    default: 'string',
  },
  width: {
    type: Number,
    default: 16,
  },
  height: {
    type: Number,
    default: 16,
  },
  iconColor: {
    type: String,
    default: '#ffffff',
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  hoverColor: {
    type: String,
    default: '#000000',
  },
  hoverBackgroundColor: {
    type: String,
  }
});
</script>

<style scoped lang="css">
.button {
  border: 1px solid #ff00ff;
  border-radius: 8px;
  padding: 4px 8px 6px 6px;
  background-color: #00ffff;
  color: v-bind(color);
  display: flex;
  align-items: center;
  padding-right: 10px;
  gap: 4px;
  max-width: 30px;
  transition: max-width 0.5s ease;
  /* transition-duration: 1s;
  transition: padding-right 2s;
  transition-property: padding-right; */
}

.button:hover {
  border: none;
  border: 1px solid;
  padding: 4px 8px 6px 6px;
  background-color: forestgreen;
  color: red;
  max-width: 100%;
  transition: max-width 0.5s ease;
  /* transition-duration: 1s;
  transition: padding-right 2s;
  transition-property: padding-right; */
}

.button .text-button {
  max-width: 0;
  height: 0;
  font-size: 16px;
  line-height: 16px;
  word-wrap: nowrap;
  overflow: hidden;
  transform: rotateX(90deg);
  transition: max-width 0.5s ease;
}

.button:hover .text-button {
  max-width: 100%;
  height: 16px;
  word-wrap: nowrap;
  overflow: hidden;
  transform: rotateX(0deg);
  transition: max-width 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  transition-duration: 1s;
}
</style>