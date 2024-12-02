<template>
  <canvas id="snow-canvas" ref="snow-canvas"></canvas>
</template>

<script lang="ts">
// 雪花类
export class Snowflake {
  private canvas;
  private ctx;
  private x;
  private y;private 
  private radius;
  private speed;
  private parms;
  constructor(canvas, parms) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.parms = parms;
    this.init();
  }

  private init(leftProp?, rightProp?) {
    const { minRadius, maxRadius, minSpeed, maxSpeed } = this.parms;
    this.x = leftProp ?? random(0, this.canvas.width);
    this.y = rightProp ?? random(0, this.canvas.height);
    this.radius = random(minRadius, maxRadius);
    this.speed = random(minSpeed, maxSpeed);
  }

  // 更新雪花的位置
  update() {
    this.y += this.speed * random(1, 1.05) * this.parms.y;
    this.x += this.speed * random(1, 1.05) * this.parms.x;
    this.radius += 0.001;
    if (this.y > this.canvas.height) {
      // 重新从顶部开始 // 随机 x 位置
      this.init(undefined, 0);
    } else if (this.y < 0) {
      this.init(undefined, this.canvas.height);
    } else if (this.x < 0) {
      this.init(this.canvas.width, undefined);
    } else if (this.x > this.canvas.width) {
      this.init(0, undefined);
    }
  }

  // 绘制雪花
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.parms.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
};

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, computed } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 100,
  },
  width: {
    type: Number,
    default: 600,
  },
  height: {
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
    default: 2,
  },
  minSpeed: {
    type: Number,
    default: 1,
  },
  maxSpeed: {
    type: Number,
    default: 2,
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.9)',
  },
  x: {
    type: String,
    default: 'center',
  },
  y: {
    type: String,
    default: 'end',
  },
  color: {
    type: String,
    default: 'white',
  },
});

// 创建雪花数组
const snowflakes: Snowflake[] = [];
const canvasTemplateRef = useTemplateRef<HTMLCanvasElement>('snow-canvas');
const direction = {
  start: -1,
  center: 0,
  end: 1,
};
const x = computed(() => direction[props.x] ?? direction.center);
const y = computed(() => direction[props.y] ?? direction.center);

onMounted(() => {
  const canvas: HTMLCanvasElement = canvasTemplateRef.value;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

  // 设置 canvas 尺寸
  canvas.width = props.width || window.innerWidth;
  canvas.height = props.height || window.innerHeight * 0.9;

  const params = {
    x: x.value,
    y: y.value,
    color: props.color,
    minRadius: props.minRadius,
    maxRadius: props.maxRadius,
    minSpeed: props.minSpeed,
    maxSpeed: props.maxSpeed,
  };
  for (let i = 0; i < props.count; i++) {
    snowflakes.push(new Snowflake(canvas, params));
  }

  // 动画循环
  function animate() {
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
/* 作为背景时，父组件需要脱离文档流 */
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
}

canvas {
  background-color: v-bind(props.backgroundColor);
}
</style>