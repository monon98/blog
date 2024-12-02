<template>
  <div>
    <span>{{ randomString }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  targetString: {
    type: String,
    default: "Hello World! My name is Monon98. This is a random string generator.",
  },
  speed: {
    type: Number,
    default: 1,
  },
  delay: {
    type: Number,
    default: 10,
  },
  immediate: {
    type: Boolean,
    default: false,
  },
  isLoop: {
    type: Boolean || Number,
    default: 3000,
  }
});

let randomString = ref("");
const targetStringLength = computed(() => props.targetString.length);
let tailPoint = 0;
let headPoint = 0;
let interval = 0;

const getRandomNumber = () => Math.floor(Math.random() * 127);

const getRandomCode = () => String.fromCharCode(getRandomNumber());

const randomize = () => {
  if (tailPoint < targetStringLength.value) {
    tailPoint++;
  } else {
    headPoint++;
  }
  if (tailPoint - headPoint > props.delay) {
    headPoint++;
  }
  // 滚动加载效果区分
  randomString.value =
    props.immediate && headPoint !== tailPoint
      ? ""
      : props.targetString.slice(0, headPoint);
  // immediate 为 true 时，会超出 targetStringLength.value 的情况，原因未知
  while (randomString.value.length < tailPoint) {
    randomString.value += getRandomCode();
  }
};

const randomizeString = () => {
  interval++;
  if (interval === props.speed) {
    randomize();
    interval = 0;
  }

  if (headPoint !== targetStringLength.value) {
    requestAnimationFrame(randomizeString);
  } else {
    if (props.isLoop || props.isLoop > -1) {
      setTimeout(() => {
        headPoint = 0;
        tailPoint = 0;
        randomizeString();
      }, props.isLoop);
    }
  }
};

onMounted(() => {
  randomizeString();
});
</script>
