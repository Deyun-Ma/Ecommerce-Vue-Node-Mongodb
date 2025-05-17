<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      // Redirect to the page the user was trying to access before being redirected to login
      // or to the home page if there's no redirect parameter
      const redirectPath = route.query.redirect as string || '/'
      router.push(redirectPath)
    } else {
      errorMessage.value = authStore.error || 'Invalid email or password'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Login</h2>
      
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
      
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--space-6);
  color: var(--color-neutral-900);
}

.auth-form {
  margin-bottom: var(--space-6);
}

.auth-footer {
  text-align: center;
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
}

.btn-block {
  width: 100%;
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
}
</style>