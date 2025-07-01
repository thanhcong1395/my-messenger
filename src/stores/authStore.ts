import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { db, auth } from '../utility/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  const initialized = ref<boolean>(false)
  const isAuthenticated = computed<boolean>(() => user.value !== null)

  const initializeAuth = async () => {
    console.log('initializeAuth')

    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          initialized.value = true
        } else {
          clearUser()
        }
        resolve()
      })
    })
  }

  const signUpUser = async (email: string, password: string) => {
    isLoading.value = true

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        email: userCredentials.user.email,
        createAt: new Date(),
      })

      clearUser()
      error.value = null
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
  }

  const signInUser = async (email: string, password: string) => {
    isLoading.value = true

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredentials.user
      error.value = null
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signOutUser = async () => {
    isLoading.value = true

    try {
      await signOut(auth)
      clearUser()
      error.value = null
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    error,
    isLoading,
    initialized,
    isAuthenticated,
    signUpUser,
    signInUser,
    initializeAuth,
    signOutUser,
  }
})
