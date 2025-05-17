<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '../stores/products';

const productStore = useProductStore();
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref<string[]>([]);

// Fetch products when component mounts
onMounted(async () => {
  await productStore.fetchProducts();
  
  // Extract unique categories
  const uniqueCategories = new Set<string>();
  productStore.products.forEach(product => {
    if (product.category) {
      uniqueCategories.add(product.category);
    }
  });
  categories.value = Array.from(uniqueCategories);
});

// Filtered products based on search and category
const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesSearch = searchQuery.value === '' || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesCategory = selectedCategory.value === '' || 
      product.category === selectedCategory.value;
    
    return matchesSearch && matchesCategory;
  });
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
};
</script>

<template>
  <div class="products-container">
    <h1 class="page-title">Products</h1>
    
    <div class="filters">
      <div class="search-filter">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="form-control"
        />
      </div>
      
      <div class="category-filter">
        <select v-model="selectedCategory" class="form-control">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <button @click="clearFilters" class="btn btn-outline">
        Clear Filters
      </button>
    </div>
    
    <div v-if="productStore.loading" class="loading-container">
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="no-products">
      <p>No products found. Try adjusting your filters.</p>
    </div>
    
    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product._id" class="product-card card">
        <div class="product-image">
          <img :src="product.imageUrl" :alt="product.name">
        </div>
        <div class="card-body">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <p class="product-category">{{ product.category }}</p>
          <div class="product-stock" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </div>
          <router-link :to="`/products/${product._id}`" class="btn btn-primary btn-block">
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-container {
  padding: var(--space-4);
}

.page-title {
  margin-bottom: var(--space-6);
  text-align: center;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-4);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.search-filter, .category-filter {
  flex: 1;
  min-width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-6);
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.4em;
}

.product-price {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary-600);
  margin-bottom: var(--space-2);
}

.product-category {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-2);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-stock {
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  display: inline-block;
  margin-bottom: var(--space-4);
}

.in-stock {
  background-color: var(--color-success-100);
  color: var(--color-success-800);
}

.out-of-stock {
  background-color: var(--color-error-100);
  color: var(--color-error-800);
}

.btn-block {
  width: 100%;
}

.loading-container, .no-products {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-neutral-600);
}
</style>