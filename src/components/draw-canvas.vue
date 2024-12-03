<template>
  <div>
    <canvas ref="draw-canvas"></canvas>
    <span class="button-group">
      <span>笔头大小：{{ lineWidth }}</span>
      <span>
        笔头颜色：{{ color }}
        <!-- <input type="color" :value="color" @click.prevent width="5" > -->
      </span>
    </span>
    <span class="button-group">
      <button class="button" @click="clearCanvas">清空画布</button>
      <span class="button color-button">
        <input
          @change="changeColor"
          :value="color"
          type="color"
          name="color"
          id="color"
        />
        <label for="color">改变颜色</label>
      </span>
      <button class="button" @click="addLineWidth">线条加粗</button>
      <button class="button" @click="reduceLineWidth">线条变细</button>
      <button
        class="button"
        @click="eliminate"
        :style="{ backgroundColor: isDrawing ? 'gray' : 'red' }"
      >
        橡皮擦
      </button>
    </span>

    <span class="button-group" id="file">
      <select name="image-type" id="image-type-select" v-model="imageType">
        <option disabled>选择保存的图片格式</option>
        <option
          v-for="imageType in imageTypeOptions"
          :key="imageType.label"
          :value="imageType.value"
        >
          {{ imageType.label }}
        </option>
      </select>
      <button class="button" @click="downloadImage">保存为图片</button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

const { backgroundColor, borderColor, ...props } = defineProps({
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 200,
  },
  backgroundColor: {
    type: String,
    default: "black",
  },
  downloadFileName: {
    type: String,
    default: "canvas",
  },
  borderColor: {
    type: String,
    default: "white",
  },
  color: {
    type: String,
    default: "white",
  },
});

let isDrawing = ref<boolean>(true);
const lineWidth = ref<number>(2);
const color = ref<string>("white");
const unWatchColor = watch(
  () => props.color,
  (newColor) => {
    color.value = newColor;
  },
  { immediate: true }
);
const canvasRef = useTemplateRef("draw-canvas");
let ctx: CanvasRenderingContext2D;
const imageType = ref<string>("image/png");
const imageTypeOptions = [
  {
    value: "image/png",
    label: "PNG",
  },
  {
    value: "image/jpeg",
    label: "JPEG",
  },
  // {
  //   value: "image/svg+xml",
  //   label: "SVG",
  // },
  {
    value: "image/webp",
    label: "WebP",
  },
];

onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  canvas.width = props.width;
  canvas.height = props.height;
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = color.value;
  ctx.lineWidth = lineWidth.value;
  clearCanvas();

  canvas.addEventListener("mousedown", (e) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    canvas.addEventListener("mousemove", onMouseMove);
  });

  canvas.addEventListener("mouseup", (e) => {
    canvas.removeEventListener("mousemove", onMouseMove);
    ctx.closePath();
    ctx.restore();
  });
});

onUnmounted(() => {
  unWatchColor();
});

const onMouseMove = (e: MouseEvent) => {
  if (isDrawing.value) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = lineWidth.value;
    ctx.strokeStyle = color;
    ctx.stroke();
  } else {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = 10;
    ctx.strokeStyle = backgroundColor;
    ctx.stroke();
  }
};

const clearCanvas = () => {
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

const changeColor = (newColor) => {
  color.value = newColor.target.value;
  ctx.strokeStyle = color.value;
};

const addLineWidth = () => {
  lineWidth.value++;
  ctx.lineWidth = lineWidth.value;
};

const reduceLineWidth = () => {
  lineWidth.value--;
  ctx.lineWidth = lineWidth.value;
};

const eliminate = () => {
  isDrawing.value = !isDrawing.value;
};

const downloadImage = () => {
  // encoderOptions 可选，表示图像质量，范围从 0 到 1，默认为 0.92
  const dataURL = canvasRef.value.toDataURL(imageType.value);

  const link = document.createElement("a");
  link.href = dataURL;
  const imageTypeOption =
    imageTypeOptions.find((option) => option.value === imageType.value) ??
    imageTypeOptions[0];
  link.download = `${
    props.downloadFileName
  }.${imageTypeOption.label.toLocaleLowerCase()}`;
  link.click();
};
</script>

<style scoped>
canvas {
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(borderColor);
}

.button-group {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  gap: 8px;
}

.button-group .button {
  padding: 5px 8px;
  border: 2px solid skyblue;
  border-radius: 4px;
}

.color-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

#file select {
  border: deepskyblue solid 2px;
  border-radius: 4px;
  padding: 4px 8px;
  width: 100px;
  display: grid;
}

#file select option {
  padding: 4px 8px;
}

#file select option:checked {
  background-color: teal;
}

#file select option:active {
  background-color: red;
}
</style>
