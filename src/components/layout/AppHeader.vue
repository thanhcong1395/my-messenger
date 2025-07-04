<template>
  <nav class="border-bottom navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <a class="navbar-brand me-3" href="#">
        <img
          src="../../assets/logo.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt="Logo"
        />
        Messengers
      </a>

      <div class="d-none d-lg-flex flex-grow-1 flex-column align-items-center">
        <form
          class="d-flex w-100 justify-content-center"
          style="max-width: 500px"
          role="search"
          @submit.prevent="search()"
        >
          <input
            v-model="searchTerm"
            class="form-control me-2"
            type="search"
            placeholder="Search conversations"
            aria-label="Search"
          />
          <button class="btn btn-outline-primary btn-sm" type="submit">Search</button>
        </form>

        <ul
          v-if="searchTerm && filteredUsers.length"
          class="list-group position-absolute mt-5 shadow"
          style="width: 432px; transform: translateX(-33px)"
        >
          <li
            v-for="user in filteredUsers"
            :key="user.id"
            class="list-group-item list-group-item-action"
            style="cursor: pointer"
            @click="createConversation(user.id, user.email)"
          >
            {{ user.email }}
          </li>
        </ul>
      </div>

      <ul class="navbar-nav ms-auto d-flex align-items-center">
        <li class="nav-link" v-if="authStore.isAuthenticated">
          Welcome, {{ authStore.user?.email }}
        </li>
        <li class="nav-item" v-if="authStore.isAuthenticated">
          <button class="btn btn-sm ms-2" @click="handleSignOut">Sign Out</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useConversationStore } from '@/stores/conversationStore'
import { ref } from 'vue'
import userService from '@/services/userService'
import type { User } from '@/models/userModel'

const authStore = useAuthStore()
const conversationStore = useConversationStore()
const router = useRouter()
const searchTerm = ref<string>('')
const filteredUsers = ref<User[]>([])

async function search() {
  if (searchTerm.value !== '') {
    filteredUsers.value = await userService.findUsers(searchTerm.value, authStore.user?.email)
    console.log(filteredUsers.value)
  }
}

async function createConversation(friendId: string, friend: string) {
  searchTerm.value = ''
  filteredUsers.value = []

  if (authStore.user) {
    if (authStore.user.email) {
      await conversationStore.createConversation({
        user1Id: authStore.user.uid,
        user1: authStore.user.email,
        user2Id: friendId,
        user2: friend,
      })
    }
  }
}

async function handleSignOut() {
  await authStore.signOutUser()
  router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
}
</script>
