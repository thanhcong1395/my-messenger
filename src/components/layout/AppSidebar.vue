<template>
  <aside class="sidebar border-end">
    <h3 class="sidebar-title">Conversations</h3>
    <ul class="chat-list">
      <li
        v-for="conversation in conversationStore.conversations"
        :key="conversation.id"
        class="chat-item"
        :class="{ active: selectedId === conversation.id }"
        @click="selectConversation(conversation.id!)"
      >
        <div class="chat-name">
          {{
            conversation.user1 === authStore.user?.email ? conversation.user2 : conversation.user1
          }}
        </div>
        <div
          class="chat-preview"
          :class="{
            unread:
              conversation.lastMessage?.senderId !== authStore.user?.uid &&
              conversation.lastMessage?.recipientIsUnread,
            'no-messages': !conversation.lastMessage?.content,
          }"
        >
          {{ conversation.lastMessage?.content || 'No messages yet' }}
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useConversationStore } from '@/stores/conversationStore'
import conversationService from '@/services/conversationService'

const authStore = useAuthStore()
const conversationStore = useConversationStore()
const selectedId = ref<string>('')

onMounted(async () => {
  if (authStore.user) {
    await conversationStore.initializeConversationList(authStore.user.uid)
  }
})

function selectConversation(conversationId: string) {
  selectedId.value = conversationId
  conversationStore.selectedConversation(selectedId.value)

  if (conversationStore.currentConversation?.lastMessage?.senderId !== authStore.user?.uid) {
    conversationService.updateConversation(conversationId)
  }
}
</script>

<style scoped>
.sidebar {
  width: 20rem;
  padding: 1rem;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.chat-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-item {
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
}

.chat-item:hover {
  background-color: #424141;
}

.chat-item.active {
  background-color: #0d6efd;
  color: white;
}

.chat-name {
  font-weight: 600;
  font-size: large;
}

.chat-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  color: #d3d2d2;
}

.chat-item.active .chat-name,
.chat-item.active .chat-preview {
  color: white;
}

.unread {
  font-weight: 600;
}

.no-messages {
  font-style: italic;
}
</style>
