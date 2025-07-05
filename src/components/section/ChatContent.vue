<template>
  <div class="chat-container">
    <div class="chat-content" ref="containerRef" @scroll.passive="handleScroll">
      <div style="width: 50rem;" class="d-flex flex-column">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message mb-1', message.senderId === authStore.user?.uid ? 'sent' : 'received']"
        >
          <div class="content">{{ message.content }}</div>
          <div
          :class="[
            message.senderId === authStore.user?.uid ? 'timestamp-send' : 'timestamp-received',
          ]"
          >
          {{ formatFriendlyTime(message.timestamp, userTimeZone) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Message } from '@/models/messageModel'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import messageService from '@/services/messageService'
import { useConversationStore } from '@/stores/conversationStore'
import { formatFriendlyTime } from '@/composibles/timeZone'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

const authStore = useAuthStore()
const conversationStore = useConversationStore()
const messages = ref<Message[]>([])
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const containerRef = ref<HTMLElement | null>(null)

let unsubscribe: (() => void) | null = null
let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
const loadingMore = ref(false)

watch(
  () => conversationStore.currentConversation?.id,
  async (conversationId) => {
    if (!conversationId) return
    if (unsubscribe) unsubscribe()
    unsubscribe = await messageService.listenToMessages(
      conversationId,
      async (newMessages, last) => {
        messages.value = newMessages
        lastVisible = last
        await scrollToBottom(false) // Cuộn xuống khi lần đầu vào chat
      },
      30,
    )
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
const scrollToBottom = async (smooth = false) => {
  await nextTick()
  const el = containerRef.value
  if (el) {
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  }
}

watch(messages, async () => {
  await nextTick()
  const el = containerRef.value
  if (!el) return
  const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 600
  if (isNearBottom) {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }
})

async function handleScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollTop === 0 && !loadingMore.value) {
    loadingMore.value = true
    await loadMoreMessages()
    loadingMore.value = false
  }
}

async function loadMoreMessages() {
  const currentId = conversationStore.currentConversation?.id
  const el = containerRef.value
  if (!currentId || !lastVisible || !el) return

  const prevScrollHeight = el.scrollHeight // Ghi lại chiều cao ban đầu

  const more = await messageService.getMoreMessages(currentId, lastVisible, 20)
  if (more.data.length > 0) {
    messages.value.unshift(...more.data.reverse())
    lastVisible = more.last

    await nextTick()

    // Scroll xuống tương đương phần vừa thêm để giữ vị trí
    const newScrollHeight = el.scrollHeight
    const delta = newScrollHeight - prevScrollHeight

    el.scrollTop = el.scrollTop + delta + 20 // kéo xuống nhẹ thêm 20px
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  height: 81.5vh;
  display: flex;
}
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
.message {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  word-break: break-word;
}
.sent {
  align-self: flex-end;
  background-color: #0d6efd;
  color: #fdfdfd;
  text-align: end;
  max-width: 60%;
}
.received {
  align-self: flex-start;
  background-color: #424141;
  max-width: 60%;
}
.timestamp-send {
  font-size: 0.75rem;
  color: #e0e0e0;
  margin-top: 0.25rem;
}
.timestamp-received {
  font-size: 0.75rem;
  color: #c9c9c9;
  margin-top: 0.25rem;
}
</style>
