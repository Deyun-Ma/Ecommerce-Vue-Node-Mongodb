<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">E-Commerce</h3>
          <p class="footer-description">Modern e-commerce management solution for your business.</p>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-title">Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/register">Register</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-title">Contact</h4>
          <ul class="footer-contact">
            <li>
              <span class="contact-label">Email:</span>
              <a href="mailto:info@ecommerce.com">info@ecommerce.com</a>
            </li>
            <li>
              <span class="contact-label">Phone:</span>
              <a href="tel:+11234567890">+1 (123) 456-7890</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} E-Commerce Management. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-neutral-800);
  color: var(--color-neutral-200);
  padding: var(--space-12) 0 var(--space-4);
  margin-top: var(--space-16);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.footer-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: white;
}

.footer-description {
  color: var(--color-neutral-400);
  margin-bottom: var(--space-4);
}

.footer-links,
.footer-contact {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-contact li {
  margin-bottom: var(--space-2);
}

.footer-links a,
.footer-contact a {
  color: var(--color-neutral-400);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.footer-links a:hover,
.footer-contact a:hover {
  color: white;
}

.contact-label {
  font-weight: 500;
  color: var(--color-neutral-300);
  margin-right: var(--space-2);
}

.footer-bottom {
  border-top: 1px solid var(--color-neutral-700);
  padding-top: var(--space-4);
  text-align: center;
}

.copyright {
  color: var(--color-neutral-500);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}
</style>