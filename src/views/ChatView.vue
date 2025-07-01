<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <div class="d-flex flex-row flex-grow-1">
      <AppSidebar class="w-64 bg-gray-100" />

      <main class="flex-grow-1">
        <AppContent />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppContent from '@/components/layout/AppContent.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
