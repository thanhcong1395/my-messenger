import type { FieldValue } from 'firebase/firestore'

export interface Conversation {
  id?: string
  user1Id: string
  user1: string
  user2Id: string
  user2: string
  lastMessage?: LastMessage
}

export interface LastMessage {
  content: string
  senderId: string
  timestamp: FieldValue
  recipientIsUnread: boolean
}
