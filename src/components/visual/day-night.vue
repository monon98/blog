<template>
  <div class="day-night" :class="{ night: isNight }">
    <!-- 天空层：背景色过渡 + 天体 -->
    <div class="sky">
      <!-- 星星（夜晚淡入） -->
      <i
        v-for="s in stars"
        :key="s.id"
        class="star"
        :style="{ left: s.x + '%', top: s.y + '%', animationDelay: s.d + 's' }"
      ></i>

      <!-- 太阳 -->
      <div class="sun" :class="{ hidden: isNight }">
        <span class="ray" v-for="n in 8" :key="n" :style="{ transform: 'rotate(' + (n * 45) + 'deg)' }"></span>
      </div>

      <!-- 月亮 -->
      <div class="moon" :class="{ shown: isNight }"></div>

      <!-- 云（白天飘动） -->
      <div class="cloud c1" :class="{ hidden: isNight }"></div>
      <div class="cloud c2" :class="{ hidden: isNight }"></div>

      <!-- 地面 -->
      <div class="ground"></div>
      <div class="hill h1"></div>
      <div class="hill h2"></div>
    </div>

    <div class="panel">
      <p class="text">{{ isNight ? '夜深了，切换回白天看看 ☀️' : '阳光正好，切换到夜晚看看 🌙' }}</p>
      <button type="button" class="toggle" @click="isNight = !isNight">
        {{ isNight ? '☀️ 切换到白天' : '🌙 切换到夜晚' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isNight = ref(false)

// 生成随机星星（一次性，SSR 安全：构建期生成固定值）
const stars = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  x: (i * 37) % 96 + 2,
  y: ((i * 53) % 55) + 4,
  d: ((i % 7) * 0.4).toFixed(1)
}))
</script>

<style scoped>
.day-night {
  width: 100%;
  max-width: 560px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

/* ---------- 天空 ---------- */
.sky {
  position: relative;
  height: 240px;
  overflow: hidden;
  /* 白天 → 夜晚：背景色 + 天体全部走 transition */
  background: linear-gradient(180deg, #38bdf8 0%, #7dd3fc 55%, #bae6fd 100%);
  transition: background 1.2s ease;
}

.day-night.night .sky {
  background: linear-gradient(180deg, #020617 0%, #0f172a 55%, #1e293b 100%);
}

/* ---------- 星星 ---------- */
.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 1.4s ease;
  animation: twinkle 2.6s ease-in-out infinite alternate;
}

.day-night.night .star { opacity: 0.9; }

@keyframes twinkle {
  from { transform: scale(0.7); }
  to { transform: scale(1.25); }
}

/* ---------- 太阳 ---------- */
.sun {
  position: absolute;
  top: 34px;
  right: 56px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff7ae, #fde047 55%, #fbbf24);
  box-shadow: 0 0 46px rgba(253, 224, 71, 0.85);
  transition: opacity 1s ease, transform 1.2s ease;
}

.sun .ray {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3px;
  height: 78px;
  margin: -39px 0 0 -1.5px;
  background: linear-gradient(180deg, #fde047 0 22%, transparent 22% 78%, #fde047 78%);
  transform-origin: center;
  opacity: 0.85;
}

.sun.hidden {
  opacity: 0;
  transform: translateY(70px) scale(0.6);
}

/* ---------- 月亮 ---------- */
.moon {
  position: absolute;
  top: 34px;
  right: 56px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fef9c3, #fde68a 60%, #fcd34d);
  box-shadow: 0 0 40px rgba(253, 222, 138, 0.6);
  opacity: 0;
  transform: translateY(70px) scale(0.6);
  transition: opacity 1s ease 0.3s, transform 1.2s ease 0.3s;
}

/* 月牙缺口 */
.moon::after {
  content: "";
  position: absolute;
  top: -5px;
  left: -12px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: transparent;
  box-shadow: inset 13px -6px 0 0 #0f172a;
  transition: box-shadow 1.2s ease;
}

.day-night:not(.night) .moon::after {
  box-shadow: inset 13px -6px 0 0 transparent;
}

.moon.shown {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ---------- 云 ---------- */
.cloud {
  position: absolute;
  height: 26px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  transition: opacity 1s ease;
  animation: drift linear infinite;
}

.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background: inherit;
}

.cloud::before { left: 14px; width: 34px; height: 34px; }
.cloud::after { left: 40px; width: 26px; height: 26px; }

.c1 { top: 66px; left: -110px; width: 96px; animation-duration: 26s; }
.c2 { top: 118px; left: -140px; width: 74px; opacity: 0.8; animation-duration: 38s; animation-delay: -14s; }

.cloud.hidden { opacity: 0; }

@keyframes drift {
  from { transform: translateX(0); }
  to { transform: translateX(680px); }
}

/* ---------- 地面与山丘 ---------- */
.ground {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  background: linear-gradient(180deg, #4ade80, #16a34a);
  transition: background 1.2s ease;
}

.day-night.night .ground {
  background: linear-gradient(180deg, #14532d, #052e16);
}

.hill {
  position: absolute;
  bottom: 30px;
  border-radius: 50% 50% 0 0;
  transition: background 1.2s ease, opacity 1.2s ease;
}

.h1 {
  left: -40px;
  width: 220px;
  height: 90px;
  background: #22c55e;
}

.h2 {
  right: -60px;
  width: 280px;
  height: 116px;
  background: #16a34a;
}

.day-night.night .h1 { background: #14532d; }
.day-night.night .h2 { background: #0f3d24; }

/* ---------- 控制面板 ---------- */
.panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  background: var(--vp-c-bg, #fff);
  transition: background 1.2s ease;
}

.day-night.night .panel {
  background: #0b1220;
}

.text {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2, #6b7280);
  transition: color 1.2s ease;
}

.day-night.night .text { color: #94a3b8; }

.toggle {
  flex-shrink: 0;
  padding: 9px 20px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 999px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
}

.day-night.night .toggle {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

@media (prefers-reduced-motion: reduce) {
  .sky,
  .sun,
  .moon,
  .star,
  .ground,
  .hill,
  .cloud {
    transition-duration: 0.01ms;
    animation: none;
  }
}
</style>
