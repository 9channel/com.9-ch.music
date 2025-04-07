<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// 语言选择
var year = (new Date).getFullYear(); 
</script>
<template>
  <!-- 顶部标签 -->
  <header>
    <img alt="Site logo" class="logo" src="@/asset/logo.png" width="72" height="72" />
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/metronome">Metronome</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <!-- 主体内容 -->
  <div class="rvc">
    <Suspense>
      <RouterView />
    </Suspense>
  </div>
  <!-- 底部标签 -->
  <footer>
    <div>
      ©{{ year }}
      <a href="https://9-ch.com">9 Channel</a> All rights reserved
    </div>
    <div>
      Powered by <a href="https://vuejs.org">Vue 3.0</a>
    </div>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}


/* 下拉框透明背景无边框 */
select {
  display: inline-block;
  padding: 0 1rem;
  background-color: transparent;
  border: none;
  width: 120px;
  color: #000;
  font-size: 14px;
  outline: none;
}

/* main位于垂直方向的中间，最小高度要求header+footer+main铺满 */
.rvc {
  min-height: calc(100vh - 122px - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* footer位于浏览器底部，占满整行 */
footer {
  width: 100%;
  height: 50px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer div {
  margin: 0 1rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: right;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .rvc {
    min-height: calc(100vh - 72px - 50px);
  }
}
</style>
