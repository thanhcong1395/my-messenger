import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'
import ChatView from '@/views/ChatView.vue'
import NotFound from '@/views/NotFound.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.HOME,
      component: ChatView,
    },
    {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/not-found',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: APP_ROUTE_NAMES.NOT_FOUND },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  const isAuthenticated = !!authStore.user

  if (to.name === APP_ROUTE_NAMES.HOME && !isAuthenticated) {
    return next({ name: APP_ROUTE_NAMES.SIGN_IN })
  }

  if (
    (to.name === APP_ROUTE_NAMES.SIGN_IN || to.name === APP_ROUTE_NAMES.SIGN_UP) &&
    isAuthenticated
  ) {
    return next({ name: APP_ROUTE_NAMES.HOME })
  }

  return next()
})

export default router
