<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <router-link :to="{ name: APP_ROUTE_NAMES.HOME }">Go back to homepage</router-link>
  </div>
</template>

<script setup lang="ts">
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  color: #2c3e50;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.not-found h1 {
  font-size: 6rem;
  margin: 0;
  color: #e74c3c;
}

.not-found p {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.home-link {
  margin-top: 1rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #2980b9;
}
</style>
