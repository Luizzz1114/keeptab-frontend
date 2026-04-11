import { createApp } from 'vue';
import { setupPrimeVue } from '@/plugins/primevue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import '@/styles.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
setupPrimeVue(app);
app.mount('#app');
