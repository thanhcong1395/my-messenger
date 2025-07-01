<!-- <template>
  <div class="d-flex flex-column min-vh-100">
    <Header />
    <div class="d-flex flex-row flex-grow-1">
      <Sidebar class="w-64 bg-gray-100" />
      <main class="flex-grow-1 p-1">
        <Content />
      </main>
    </div>
    <Footer />
  </div>
</template> -->

<template>
  <RouterView />
</template>

<script setup lang="ts">
import Header from './components/layout/AppHeader.vue'
import Sidebar from './components/layout/AppSidebar.vue'
import Content from './components/layout/AppContent.vue'
import Footer from './components/layout/AppFooter.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>
