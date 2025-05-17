import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URL } from '../config'

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async register(name: string, email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/api/users/register`, {
          name,
          email,
          password
        })
        
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', response.data.token)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/api/users/login`, {
          email,
          password
        })
        
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', response.data.token)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserProfile() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.user = response.data
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error)
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})