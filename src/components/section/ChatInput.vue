<template>
  <div class="chat-input-container d-flex justify-content-center align-items-center h-100">
    <form @submit.prevent="sendMessage" class="d-flex w-100 justify-content-center">
      <input
        v-model="message"
        placeholder="Type your message..."
        class="form-control me-2"
        style="width: 50%"
        @click="markAsReaded()"
      />

      <button type="submit" :disabled="!message.trim()" class="btn btn-primary">
        <i class="bi bi-send"></i>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import conversationService from '@/services/conversationService'
import messageService from '@/services/messageService'
import { useAuthStore } from '@/stores/authStore'
import { useConversationStore } from '@/stores/conversationStore'
import { ref } from 'vue'

const message = ref<string>('')
const conversationStore = useConversationStore()
const authStore = useAuthStore()

const sendMessage = async () => {
  const currentConversation = conversationStore.currentConversation
  const mes = message.value
  const senderId = authStore.user?.uid

  if (mes.trim() && currentConversation && senderId) {
    message.value = '' // Xoá input ngay lập tức

    await messageService.sendMessage({
      conversationId: currentConversation.id!,
      senderId: senderId,
      recipientId:
        senderId === currentConversation.user1Id
          ? currentConversation.user2Id
          : currentConversation.user1Id,
      content: mes,
    })
  }
}

const markAsReaded = async () => {
  if (
    conversationStore.currentConversation?.lastMessage?.senderId !== authStore.user?.uid &&
    conversationStore.currentConversation?.id &&
    conversationStore.currentConversation?.lastMessage?.recipientIsUnread
  ) {
    await conversationService.updateConversation(conversationStore.currentConversation?.id)
  }
}
</script>
