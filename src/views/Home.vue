<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()
const featuredProducts = ref([])

onMounted(async () => {
  await productStore.fetchProducts()
  featuredProducts.value = productStore.products.slice(0, 4)
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Modern E-Commerce Management</h1>
          <p class="hero-subtitle">Streamline your business with our powerful platform</p>
          <div class="hero-actions">
            <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
            <router-link to="/register" class="btn btn-outline ml-4">Get Started</router-link>
          </div>
        </div>
      </div>
    </section>
    
    <section class="featured-section">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <div v-if="productStore.loading" class="text-center">
          <p>Loading products...</p>
        </div>
        <div v-else-if="featuredProducts.length === 0" class="text-center">
          <p>No products available at the moment.</p>
        </div>
        <div v-else class="grid grid-cols-1 grid-cols-sm-2 grid-cols-md-3 grid-cols-lg-4">
          <div v-for="product in featuredProducts" :key="product._id" class="card product-card">
            <div class="product-image">
              <img :src="product.imageUrl" :alt="product.name">
            </div>
            <div class="card-body">
              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <p class="product-category">{{ product.category }}</p>
              <router-link :to="`/products/${product._id}`" class="btn btn-primary btn-block">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Us</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📦</div>
            <h3 class="feature-title">Easy Inventory Management</h3>
            <p class="feature-description">Manage your inventory with ease, track stock levels, and receive alerts when items are running low.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Detailed Analytics</h3>
            <p class="feature-description">Gain insights into your sales performance with comprehensive analytics and reporting tools.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🛒</div>
            <h3 class="feature-title">Seamless Shopping Experience</h3>
            <p class="feature-description">Provide your customers with a smooth and intuitive shopping experience across all devices.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Secure Transactions</h3>
            <p class="feature-description">Rest easy knowing that all transactions are protected with industry-leading security measures.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-500) 100%);
  color: white;
  padding: var(--space-16) 0;
  margin-bottom: var(--space-16);
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-8);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-8);
  position: relative;
  padding-bottom: var(--space-4);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--color-primary-500);
}

.featured-section {
  margin-bottom: var(--space-16);
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
}

.product-price {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary-600);
  margin-bottom: var(--space-2);
}

.product-category {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-block {
  width: 100%;
}

.features-section {
  background-color: var(--color-neutral-100);
  padding: var(--space-16) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

.feature-card {
  background-color: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

.feature-title {
  margin-bottom: var(--space-2);
  color: var(--color-neutral-900);
}

.feature-description {
  color: var(--color-neutral-600);
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>