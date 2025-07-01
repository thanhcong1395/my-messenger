<template>
  <div v-if="conversationStore.currentConversation" class="app-content">
    <div class="chat-content">
      <ChatContent />
    </div>

    <div class="chat-input">
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatContent from '../section/ChatContent.vue'
import ChatInput from '../section/ChatInput.vue'
import { useConversationStore } from '@/stores/conversationStore'

const conversationStore = useConversationStore()
</script>

<style scoped>
.app-content {
  position: relative;
  height: 89vh;
  display: flex;
  flex-direction: column;
}

/* Vùng nội dung chat cuộn được bên trong, không đụng vào footer */
.chat-content {
  /* flex: 1; */
  /* overflow-y: auto; */
  /* padding-bottom: 5px; Tránh che bởi chat input */
  padding-top: 1px;
}

/* Input gắn phía dưới vùng content, không gắn với viewport */
.chat-input {
  background: white;
  border-top: 1px solid #ddd;
  padding: 1rem;
  flex-shrink: 0; /* đảm bảo không bị nén */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
}
</style>
