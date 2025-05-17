<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const register = async () => {
  // Validate form
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.register(name.value, email.value, password.value)
    
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = authStore.error || 'Registration failed'
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Create Account</h2>
      
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
      
      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Enter your name"
            required
          />
        </div>
        
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
        
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
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