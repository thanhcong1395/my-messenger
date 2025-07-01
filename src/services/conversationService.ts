import type { Conversation } from '@/models/conversationModel'
import { db } from '../utility/firebaseConfig'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  type Unsubscribe,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore'
const TABLE = 'conversations'
const dbCollection = collection(db, TABLE)

export default {
  async getConversations(user: string): Promise<Conversation[]> {
    const q1 = query(dbCollection, where('user1', '==', user))
    const q2 = query(dbCollection, where('user2', '==', user))

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const allDocs = [...snapshot1.docs, ...snapshot2.docs]

    const result: Conversation[] = allDocs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Conversation, 'id'>),
    }))

    return result
  },

  async createConversation(conversation: Conversation): Promise<Conversation | null> {
    const { user1, user2 } = conversation

    const q1 = query(dbCollection, where('user1', '==', user1), where('user2', '==', user2))
    const q2 = query(dbCollection, where('user1', '==', user2), where('user2', '==', user1))

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])

    if (!snap1.empty || !snap2.empty) {
      return null
    }

    const docRef = await addDoc(dbCollection, conversation)
    return { id: docRef.id, ...conversation }
  },

  listenToUserConversationsByUserId(
    userId: string,
    callback: (conversations: Conversation[]) => void,
  ): Unsubscribe {
    const conversations: Conversation[] = []
    const unsubscribers: Unsubscribe[] = []

    function handleSnapshot(snapshot: any) {
      snapshot.docChanges().forEach((change: any) => {
        const data = {
          id: change.doc.id,
          ...(change.doc.data() as Omit<Conversation, 'id'>),
        }

        const index = conversations.findIndex((c) => c.id === data.id)

        if (change.type === 'added' && index === -1) {
          conversations.push(data)
        } else if (change.type === 'modified' && index !== -1) {
          conversations[index] = data
        } else if (change.type === 'removed' && index !== -1) {
          conversations.splice(index, 1)
        }
      })

      // Gửi danh sách cập nhật
      callback(
        [...conversations].sort((a, b) => {
          const toMillis = (t: any): number => {
            if (!t) return 0
            if (typeof t.toMillis === 'function') return t.toMillis()
            if (t instanceof Date) return t.getTime()
            return 0
          }

          return toMillis(b.lastMessage?.timestamp) - toMillis(a.lastMessage?.timestamp)
        }),
      )
    }

    // Lắng nghe user1Id
    const q1 = query(dbCollection, where('user1Id', '==', userId))
    unsubscribers.push(onSnapshot(q1, handleSnapshot))

    // Lắng nghe user2Id
    const q2 = query(dbCollection, where('user2Id', '==', userId))
    unsubscribers.push(onSnapshot(q2, handleSnapshot))

    // Trả về hàm unsubscribe tổng
    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  },

  async updateConversation(conversationId: string) {
    await updateDoc(doc(dbCollection, conversationId), {
      'lastMessage.recipientIsUnread': false,
    })
  },
}
