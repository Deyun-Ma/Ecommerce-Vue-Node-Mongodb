<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const id = route.params.id as string;
const loading = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    await productStore.fetchProductById(id);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error loading product';
  }
});

const deleteProduct = async () => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  loading.value = true;
  
  try {
    await productStore.deleteProduct(id);
    router.push('/products');
  } catch (error: any) {
    errorMessage.value = error.message || 'Error deleting product';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="product-detail-container">
    <div v-if="productStore.loading" class="loading-container">
      <p>Loading product details...</p>
    </div>
    
    <div v-else-if="errorMessage" class="error-container">
      <div class="alert alert-error">{{ errorMessage }}</div>
      <router-link to="/products" class="btn btn-primary mt-4">Back to Products</router-link>
    </div>
    
    <div v-else-if="!productStore.product" class="not-found-container">
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <router-link to="/products" class="btn btn-primary mt-4">Back to Products</router-link>
    </div>
    
    <div v-else class="product-detail">
      <div class="product-image-container">
        <img :src="productStore.product.imageUrl" :alt="productStore.product.name" class="product-image">
      </div>
      
      <div class="product-info">
        <h1 class="product-title">{{ productStore.product.name }}</h1>
        
        <div class="product-meta">
          <span class="product-category">{{ productStore.product.category }}</span>
          <span class="product-stock" :class="{ 'in-stock': productStore.product.inStock, 'out-of-stock': !productStore.product.inStock }">
            {{ productStore.product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
        
        <p class="product-price">${{ productStore.product.price.toFixed(2) }}</p>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ productStore.product.description }}</p>
        </div>
        
        <div class="product-quantity" v-if="productStore.product.inStock">
          <h3>Quantity Available</h3>
          <p>{{ productStore.product.quantity }} units</p>
        </div>
        
        <div class="product-actions">
          <button class="btn btn-primary btn-lg">Add to Cart</button>
          
          <template v-if="authStore.isAdmin">
            <router-link :to="`/edit-product/${productStore.product._id}`" class="btn btn-secondary btn-lg ml-4">
              Edit
            </router-link>
            <button @click="deleteProduct" class="btn btn-danger btn-lg ml-4" :disabled="loading">
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <div class="back-link">
      <router-link to="/products" class="btn btn-outline">
        ← Back to Products
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.product-detail-container {
  padding: var(--space-4);
}

.loading-container, .error-container, .not-found-container {
  text-align: center;
  padding: var(--space-8);
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
}

.product-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  overflow: hidden;
  border-radius: var(--border-radius-md);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.product-category {
  background-color: var(--color-neutral-200);
  color: var(--color-neutral-800);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.product-stock {
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-full);
}

.in-stock {
  background-color: var(--color-success-100);
  color: var(--color-success-800);
}

.out-of-stock {
  background-color: var(--color-error-100);
  color: var(--color-error-800);
}

.product-price {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: var(--space-6);
}

.product-description, .product-quantity {
  margin-bottom: var(--space-6);
}

.product-description h3, .product-quantity h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
  color: var(--color-neutral-800);
}

.product-description p {
  color: var(--color-neutral-700);
  line-height: 1.6;
}

.product-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.btn-lg {
  padding: var(--space-3) var(--space-8);
  font-size: var(--font-size-md);
}

.back-link {
  margin-top: var(--space-4);
}

@media (min-width: 768px) {
  .product-detail {
    grid-template-columns: minmax(300px, 40%) 1fr;
  }
}
</style>