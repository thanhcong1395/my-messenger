<template>
  <div class="container py-5 my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border rounded">
        <div class="card-body p-4">
          <h4 class="text-center mb-4">Create Account</h4>
          <form @submit.prevent="handleSignUp">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="form.email" class="form-control" id="email" required />
            </div>
            <div class="mb-4">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                v-model="form.password"
                class="form-control"
                id="password"
                required
              />
            </div>
            <button :disabled="authStore.isLoading" type="submit" class="btn btn-success w-100">
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Create Account
            </button>
            <div class="alert alert-danger mt-3 mb-0" v-if="error">{{ error }}</div>
          </form>
          <p class="mt-3 form-label text-center">
            Already have an account?
            <router-link :to="APP_ROUTE_NAMES.SIGN_IN">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSwal } from '@/composibles/useSwal'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'
import type { Auth } from '@/models/authModel'

const { showSuccess } = useSwal()
const error = ref('')
const authStore = useAuthStore()
const form = reactive<Auth>({
  email: '',
  password: '',
})

const handleSignUp = async () => {
  try {
    error.value = ''
    console.log(form)
    authStore.signUpUser(form.email, form.password)
    showSuccess('Account created successfully')
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    }
  }
}
</script>
