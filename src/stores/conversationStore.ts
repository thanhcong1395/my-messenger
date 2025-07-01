import type { Conversation } from '@/models/conversationModel'
import conversationService from '@/services/conversationService'
import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import type { Unsubscribe } from 'firebase/firestore'

export const useConversationStore = defineStore('conversationStore', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation>()
  let unsubscribe: Unsubscribe | null = null

  const initializeConversationList = async (userId: string | null) => {
    if (!userId) return

    // Ngắt lắng nghe cũ nếu có
    if (unsubscribe) unsubscribe()

    // Thiết lập lắng nghe real-time
    unsubscribe = conversationService.listenToUserConversationsByUserId(userId, (data) => {
      conversations.value.splice(0, conversations.value.length, ...data)

      const conversationId = currentConversation.value?.id
      selectedConversation(conversationId!)
    })
  }

  const createConversation = async (conversation: Conversation) => {
    await conversationService.createConversation({
      user1Id: conversation.user1Id,
      user1: conversation.user1,
      user2Id: conversation.user2Id,
      user2: conversation.user2,
    })
  }

  const selectedConversation = (conversationId: string) => {
    currentConversation.value = conversations.value.find((e) => e.id === conversationId)
  }

  // Ngắt khi component bị huỷ
  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    conversations,
    currentConversation,
    initializeConversationList,
    createConversation,
    selectedConversation,
  }
})
