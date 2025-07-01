import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/routes'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'
// import PrimeVue from 'primevue/config'
const app = createApp(App)
// app.use(PrimeVue)

app.use(createPinia())

app.use(router)

app.mount('#app')
