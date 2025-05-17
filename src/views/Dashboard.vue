<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const productStore = useProductStore();
const authStore = useAuthStore();
const router = useRouter();

const totalProducts = computed(() => productStore.products.length);
const inStockProducts = computed(() => productStore.products.filter(p => p.inStock).length);
const outOfStockProducts = computed(() => productStore.products.filter(p => !p.inStock).length);

const loading = ref(false);
const deleteLoading = ref<string | null>(null);
const errorMessage = ref('');

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/');
    return;
  }
  
  loading.value = true;
  try {
    await productStore.fetchProducts();
  } catch (error: any) {
    errorMessage.value = error.message || 'Error loading products';
  } finally {
    loading.value = false;
  }
});

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  deleteLoading.value = id;
  
  try {
    await productStore.deleteProduct(id);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error deleting product';
  } finally {
    deleteLoading.value = null;
  }
};
</script>

<template>
  <div class="dashboard-container">
    <h1 class="page-title">Admin Dashboard</h1>
    
    <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
    
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3 class="stat-title">Total Products</h3>
          <p class="stat-value">{{ totalProducts }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3 class="stat-title">In Stock</h3>
          <p class="stat-value">{{ inStockProducts }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <h3 class="stat-title">Out of Stock</h3>
          <p class="stat-value">{{ outOfStockProducts }}</p>
        </div>
      </div>
    </div>
    
    <div class="action-bar">
      <h2 class="section-title">Product Management</h2>
      <router-link to="/add-product" class="btn btn-primary">Add New Product</router-link>
    </div>
    
    <div v-if="loading" class="loading-container">
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="productStore.products.length === 0" class="no-products">
      <p>No products available. Start by adding a new product.</p>
    </div>
    
    <div v-else class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product._id">
            <td class="product-image-cell">
              <img :src="product.imageUrl" :alt="product.name" class="product-thumbnail">
            </td>
            <td>{{ product.name }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>{{ product.category }}</td>
            <td>
              <span class="stock-badge" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
            <td class="action-cell">
              <router-link :to="`/products/${product._id}`" class="btn btn-outline btn-sm">
                View
              </router-link>
              <router-link :to="`/edit-product/${product._id}`" class="btn btn-secondary btn-sm ml-2">
                Edit
              </router-link>
              <button 
                @click="deleteProduct(product._id)"
                class="btn btn-danger btn-sm ml-2"
                :disabled="deleteLoading === product._id"
              >
                {{ deleteLoading === product._id ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: var(--space-4);
}

.page-title {
  margin-bottom: var(--space-8);
  text-align: center;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: var(--space-4);
}

.stat-title {
  font-size: var(--font-size-md);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-1);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary-700);
  margin: 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.section-title {
  margin: 0;
}

.loading-container, .no-products {
  text-align: center;
  padding: var(--space-8);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.product-table-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-neutral-200);
}

.product-table th {
  background-color: var(--color-neutral-100);
  font-weight: 600;
  color: var(--color-neutral-800);
}

.product-image-cell {
  width: 80px;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.stock-badge {
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
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

.action-cell {
  white-space: nowrap;
}

.btn-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
}
</style>