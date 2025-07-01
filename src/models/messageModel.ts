import type { FieldValue } from 'firebase/firestore'

export interface Message {
  id?: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  timestamp?: FieldValue
}
