<template>
  <div id="app">
    <nav>
      <router-link to="/quiz-manager">Quiz Manager</router-link>
      <router-link to="/glossary-editor">Glossary Editor</router-link>
      <router-link to="/hotspot-generator">Hotspot Generator</router-link>
    </nav>
    <keep-alive><router-view :key="$route.path"/></keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style scoped>
nav {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #2c3e50;
  font-size: 1.5rem;
}
</style>
