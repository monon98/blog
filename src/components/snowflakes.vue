<template>
  <canvas id="snow-canvas" ref="snow-canvas"></canvas>
</template>

<script lang="ts">
// 雪花类
class Snowflake {
  canvas;
  ctx;
  x;
  y;
  radius;
  speed;
  parms;
  constructor(canvas, parms) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.parms = parms;
    this.init();
  }

  init(widthProp?, heightProp?) {
    const {minRadius, maxRadius, minSpeed, maxSpeed} = this.parms;
    const width = widthProp?? this.canvas.width;
    const height = heightProp??this.canvas.height;
    this.x = random(0, width);
    this.y = random(0, height);
    this.radius = random(minRadius, maxRadius);
    this.speed = random(minSpeed, maxSpeed);
  }

  // 更新雪花的位置
  update() {
    this.y += this.speed;
    this.x += this.speed * (Math.random() * 0.5) + this.speed; // 随机 x 方向移动
    if (this.y > this.canvas.height) {
      // 重新从顶部开始 // 随机 x 位置
      this.init(undefined, 0);
    } else if (this.x > this.canvas.width) {
      this.init(0, undefined);
    }
  }

  // 绘制雪花
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }
};

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef, reactive } from 'vue';


const props = defineProps({
  snowflakesCount: {
    type: Number,
    default: 100,
  },
  canvasWidth: {
    type: Number,
    default: 600,
  },
  canvasHeight: {
    type: Number,
    default: 400,
  },
  isAutoResize: {
    type: Boolean,
    default: false,
  },
  minRadius: {
    type: Number,
    default: 1,
  },
  maxRadius: {
    type: Number,
    default: 4,
  },
  minSpeed: {
    type: Number,
    default: 1,
  },
  maxSpeed: {
    type: Number,
    default: 2,
  },  
});

// 创建雪花数组
const snowflakes: Snowflake[] = [];
const canvasTemplateRef = useTemplateRef<HTMLCanvasElement>('snow-canvas');

onMounted(() => {
  const canvas: HTMLCanvasElement = canvasTemplateRef.value;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

  // 设置 canvas 尺寸
  canvas.width = props.canvasWidth || window.innerWidth;
  canvas.height = props.canvasHeight || window.innerHeight;

  const params = {
      minRadius: props.minRadius,
      maxRadius: props.maxRadius,
      minSpeed: props.minSpeed,
      maxSpeed: props.maxSpeed,
    };
  for (let i = 0; i < props.snowflakesCount; i++) {
    // const x = random(0, canvas.width); // 随机 x 位置
    // const y = random(0, canvas.height); // 随机 y 位置

    snowflakes.push(new Snowflake(canvas, params));
  }

  // 动画循环
  function animate() {
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.332)';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    snowflakes.forEach(snowflake => {
      snowflake.update();
      snowflake.draw();
    });
    requestAnimationFrame(animate); // 递归调用
  }

  animate(); // 启动动画

  if (props.isAutoResize) {
    // 窗口大小变化时更新 canvas 尺寸
    resizeFunction = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeFunction);
  }
});

let resizeFunction;

onUnmounted(() => {
  if (resizeFunction) {
    window.removeEventListener('resize', resizeFunction);
    resizeFunction = null;
  }
});
</script>

<style scoped lang="css">
/* 父组件需要脱离文档流 */
.snow-canvas {
  overflow: hidden;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
}

canvas {

  background-color: rgba(0, 0, 0, 0.9);
}
</style>