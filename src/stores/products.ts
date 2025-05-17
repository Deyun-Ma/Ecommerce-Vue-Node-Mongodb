import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuthStore } from './auth'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  inStock: boolean
  quantity: number
  createdAt: string
  updatedAt: string
}

interface ProductsState {
  products: Product[]
  product: Product | null
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    product: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/products`)
        this.products = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchProductById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`)
        this.product = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      
      const authStore = useAuthStore()
      
      try {
        const response = await axios.post(
          `${API_URL}/api/products`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )
        
        this.products.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create product'
        console.error('Error creating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateProduct(id: string, productData: Partial<Product>) {
      this.loading = true
      this.error = null
      
      const authStore = useAuthStore()
      
      try {
        const response = await axios.put(
          `${API_URL}/api/products/${id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )
        
        const index = this.products.findIndex(p => p._id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        
        this.product = response.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update product'
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteProduct(id: string) {
      this.loading = true
      this.error = null
      
      const authStore = useAuthStore()
      
      try {
        await axios.delete(`${API_URL}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })
        
        this.products = this.products.filter(p => p._id !== id)
        
        if (this.product?._id === id) {
          this.product = null
        }
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete product'
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})