import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { createPinia } from 'pinia'

const language = document.documentElement.lang;
const messages = {
  en,
  fr,
};
const i18n = createI18n({
  legacy: false,
  locale: language,
  messages,
});

const app = createApp(App);
app.use(createPinia())
app.use(i18n);
app.mount("#app");
