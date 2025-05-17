<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

// Check if user is admin
if (!authStore.isAuthenticated || !authStore.isAdmin) {
  router.push('/login');
}

const product = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  inStock: true,
  quantity: 0
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Toys',
  'Other'
];

const validateForm = () => {
  if (!product.value.name.trim()) {
    errorMessage.value = 'Product name is required';
    return false;
  }
  
  if (!product.value.description.trim()) {
    errorMessage.value = 'Product description is required';
    return false;
  }
  
  if (product.value.price <= 0) {
    errorMessage.value = 'Price must be greater than 0';
    return false;
  }
  
  if (!product.value.category) {
    errorMessage.value = 'Please select a category';
    return false;
  }
  
  return true;
};

const createProduct = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    await productStore.createProduct(product.value);
    successMessage.value = 'Product created successfully!';
    
    // Reset form
    product.value = {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      inStock: true,
      quantity: 0
    };
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } catch (error: any) {
    console.error('Error creating product:', error);
    errorMessage.value = error.message || 'Failed to create product';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="add-product-container">
    <h1 class="page-title">Add New Product</h1>
    
    <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    
    <div class="form-card">
      <form @submit.prevent="createProduct">
        <div class="form-group">
          <label for="name" class="form-label">Product Name</label>
          <input
            id="name"
            v-model="product.name"
            type="text"
            class="form-control"
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="product.description"
            class="form-control"
            placeholder="Enter product description"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="price" class="form-label">Price ($)</label>
            <input
              id="price"
              v-model.number="product.price"
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              placeholder="0.00"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="category" class="form-label">Category</label>
            <select
              id="category"
              v-model="product.category"
              class="form-control"
              required
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="imageUrl" class="form-label">Image URL</label>
          <input
            id="imageUrl"
            v-model="product.imageUrl"
            type="url"
            class="form-control"
            placeholder="Enter image URL (optional)"
          />
          <small class="form-text">Leave empty to use default image</small>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="quantity" class="form-label">Quantity in Stock</label>
            <input
              id="quantity"
              v-model.number="product.quantity"
              type="number"
              min="0"
              class="form-control"
              placeholder="0"
            />
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="product.inStock">
              <span>In Stock</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="router.push('/dashboard')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creating...' : 'Add Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-product-container {
  padding: var(--space-4);
}

.page-title {
  margin-bottom: var(--space-6);
  text-align: center;
}

.form-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.form-text {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
  margin-top: var(--space-1);
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  margin-right: var(--space-2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

@media (min-width: 576px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>