<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useConversationStore } from '@/stores/conversationStore'

const authStore = useAuthStore()
const conversationStore = useConversationStore()

let originalTitle = document.title
let titleInterval: number | undefined = undefined

function startFlashingTitle(unreadCount: number) {
  if (document.hidden && !titleInterval) {
    titleInterval = window.setInterval(() => {
      document.title =
        document.title === originalTitle
          ? `(${unreadCount}) New message`
          : originalTitle
    }, 1000)
  }
}

function stopFlashingTitle() {
  if (titleInterval) {
    clearInterval(titleInterval)
    titleInterval = undefined
  }
  document.title = originalTitle
}

// Theo dõi thay đổi danh sách cuộc trò chuyện
watch(
  () => conversationStore.conversations,
  (conversations) => {
    const unreadCount = conversations.filter((c) =>
      c.lastMessage?.recipientIsUnread &&
      c.lastMessage?.senderId !== authStore.user?.uid
    ).length

    if (unreadCount > 0  && document.hidden) {
      startFlashingTitle(unreadCount)
    } else {
      stopFlashingTitle()
    }
  },
  { deep: true, immediate: true }
)

function handleVisibilityChange() {
  if (!document.hidden) {
    stopFlashingTitle()
  }
}

onMounted(() => {
  originalTitle = document.title
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopFlashingTitle()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
