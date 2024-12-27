<template>
  <div id="ui">
    <div v-for="(char, index) in 'STORE'" :key="index" class="text">
      <div class="text_inner1">
        <div class="text_inner2">{{ char }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#ui {
  transform: rotateZ(-4deg);
  position: relative;
  height: 40px;
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.text {
  position: relative;
  font-size: 2rem;
  color: #fff;
  line-height: 2rem;
  font-family: "Anton", sans-serif;
  letter-spacing: 0.3rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.text:nth-child(1) {
  color: #00FFFF;
  filter: blur(1px);
}

.text:nth-child(2) {
  color: #FF00FF;
  filter: blur(2px);
}

.text:nth-child(3) {
  color: #00FFFF;
  filter: blur(1px);
}

.text:nth-child(4) {
  color: #FF00FF;
  filter: blur(2px);
}

.text:nth-child(5) {
  color: #00FFFF;
  filter: blur(1px);
}

.text_inner1 {
  animation: vertical 1s ease-in-out infinite alternate;
}

.text_inner2 {
  animation: horizontal 0.8s ease-in-out infinite alternate;
}

@keyframes horizontal {
  0% { transform: translateX(3px); }
  100% { transform: translateX(-3px); }
}

@keyframes vertical {
  0% { transform: translateY(2px); }
  100% { transform: translateY(-2px); }
}
</style> 