<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/')
  closeMobileMenu()
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="header-logo">
          <router-link to="/" @click="closeMobileMenu">
            E-Commerce
          </router-link>
        </div>
        
        <nav class="header-nav" :class="{ 'mobile-menu-open': mobileMenuOpen }">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" @click="closeMobileMenu">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products" @click="closeMobileMenu">Products</router-link>
            </li>
            <template v-if="isAuthenticated">
              <li class="nav-item" v-if="isAdmin">
                <router-link to="/dashboard" @click="closeMobileMenu">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <span class="user-greeting">Hi, {{ user?.name }}</span>
              </li>
              <li class="nav-item">
                <button class="btn-link" @click="logout">Logout</button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link to="/login" @click="closeMobileMenu">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register" class="btn btn-primary" @click="closeMobileMenu">Register</router-link>
              </li>
            </template>
          </ul>
        </nav>
        
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.header-logo a {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary-600);
  transition: color var(--transition-fast);
}

.header-logo a:hover {
  color: var(--color-primary-800);
}

.header-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: var(--space-6);
}

.nav-item a, .nav-item button.btn-link {
  color: var(--color-neutral-700);
  font-weight: 500;
  transition: color var(--transition-fast);
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.nav-item a:hover, .nav-item button.btn-link:hover {
  color: var(--color-primary-600);
}

.router-link-active {
  color: var(--color-primary-600) !important;
  font-weight: 600;
}

.user-greeting {
  color: var(--color-neutral-700);
  font-weight: 500;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 24px;
  position: relative;
  z-index: 200;
}

.mobile-menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-neutral-800);
  margin: 5px 0;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
}

@media (max-width: 768px) {
  .header-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    height: 100vh;
    background-color: white;
    transition: right var(--transition-normal);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  .header-nav.mobile-menu-open {
    right: 0;
  }

  .nav-list {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: var(--space-8);
  }

  .mobile-menu-toggle {
    display: block;
  }

  .mobile-menu-open + .mobile-menu-toggle span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .mobile-menu-open + .mobile-menu-toggle span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-open + .mobile-menu-toggle span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}
</style>