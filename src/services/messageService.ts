import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  startAfter,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/utility/firebaseConfig'
import type { Message } from '@/models/messageModel'

const TABLE = 'messages'
const dbCollection = collection(db, TABLE)

export default {
  async sendMessage(message: Message): Promise<Message> {
    const docRef = await addDoc(dbCollection, {
      ...message,
      timestamp: serverTimestamp(),
    })

    await updateDoc(doc(db, 'conversations', message.conversationId), {
      lastMessage: {
        content: message.content,
        timestamp: serverTimestamp(),
        senderId: message.senderId,
        recipientIsUnread: true,
      },
    })

    return { id: docRef.id, ...message }
  },

  async listenToMessages(
    conversationId: string,
    callback: (
      messages: Message[],
      lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    ) => void,
    limitCount = 30,
  ): Promise<Unsubscribe> {
    const q = query(
      dbCollection,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(limitCount),
    )

    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
      const messages: Message[] = docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>),
      }))

      const lastVisible = docs[docs.length - 1] ?? null
      callback(messages.reverse(), lastVisible)
    })
  },

  async getMoreMessages(
    conversationId: string,
    afterDoc: QueryDocumentSnapshot<DocumentData>,
    limitCount = 20,
  ): Promise<{ data: Message[]; last: QueryDocumentSnapshot<DocumentData> | null }> {
    const q = query(
      dbCollection,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      startAfter(afterDoc),
      limit(limitCount),
    )

    const snapshot = await getDocs(q)
    const docs = snapshot.docs
    const messages: Message[] = docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Message, 'id'>),
    }))

    const last = docs[docs.length - 1] ?? null
    return { data: messages, last }
  },
}
