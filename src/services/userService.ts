import type { User } from '@/models/userModel'
import { db } from '../utility/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const TABLE = 'users'
const dbCollection = collection(db, TABLE)

export default {
  async findUsers(keyword: string, currentUser: string | null | undefined): Promise<User[]> {
    const snapshot = await getDocs(dbCollection)

    const allUsers: User[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, 'id'>),
    }))

    const result = allUsers.filter(
      (u) =>
        u.email?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) &&
        u.email?.toLocaleLowerCase() !== currentUser?.toLocaleLowerCase(),
    )

    return result
  },
}
