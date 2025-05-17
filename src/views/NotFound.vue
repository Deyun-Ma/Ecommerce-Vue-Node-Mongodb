<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Page Not Found</h2>
      <p class="not-found-description">The page you're looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
  padding: var(--space-8);
}

.not-found-title {
  font-size: 6rem;
  color: var(--color-primary-500);
  margin: 0;
  line-height: 1;
}

.not-found-subtitle {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
}

.not-found-description {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-8);
}
</style>