<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const authStore = useAuthStore();
const id = route.params.id as string;

// Redirect if not admin
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
const fetchLoading = ref(true);
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

onMounted(async () => {
  fetchLoading.value = true;
  
  try {
    await productStore.fetchProductById(id);
    
    if (productStore.product) {
      product.value = {
        name: productStore.product.name,
        description: productStore.product.description,
        price: productStore.product.price,
        category: productStore.product.category,
        imageUrl: productStore.product.imageUrl,
        inStock: productStore.product.inStock,
        quantity: productStore.product.quantity
      };
    } else {
      errorMessage.value = 'Product not found';
    }
  } catch (error: any) {
    console.error('Error fetching product:', error);
    errorMessage.value = error.message || 'Failed to fetch product';
  } finally {
    fetchLoading.value = false;
  }
});

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

const updateProduct = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    await productStore.updateProduct(id, product.value);
    successMessage.value = 'Product updated successfully!';
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } catch (error: any) {
    console.error('Error updating product:', error);
    errorMessage.value = error.message || 'Failed to update product';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="edit-product-container">
    <h1 class="page-title">Edit Product</h1>
    
    <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    
    <div v-if="fetchLoading" class="loading-container">
      <p>Loading product data...</p>
    </div>
    
    <div v-else class="form-card">
      <form @submit.prevent="updateProduct">
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
        
        <div class="image-preview" v-if="product.imageUrl">
          <h3 class="preview-title">Image Preview</h3>
          <img :src="product.imageUrl" alt="Product preview" class="preview-image">
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="router.push('/dashboard')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.edit-product-container {
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

.loading-container {
  text-align: center;
  padding: var(--space-8);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
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

.image-preview {
  margin-top: var(--space-6);
  text-align: center;
}

.preview-title {
  margin-bottom: var(--space-4);
  font-size: var(--font-size-lg);
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
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