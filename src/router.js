import { createRouter, createWebHistory } from 'vue-router';
import QuizManager from './components/QuizManager.vue';
import GlossaryEditor from './components/GlossaryEditor.vue';
import HotspotGenerator from './components/HotspotGenerator.vue';

const routes = [
  // { path: '/', redirect: '/quiz-manager' },
  { path: '/', component: QuizManager },
  { path: '/glossary-editor', component: GlossaryEditor },
  { path: '/hotspot-generator', component: HotspotGenerator },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
