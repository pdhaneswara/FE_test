// composables/useProducts.ts
import { ref } from 'vue'
import { $fetch } from 'ofetch'

export function useProducts() {
  const products = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async (category?: string) => {
    loading.value = true
    error.value = null
    try {
      const url =
        category && category !== 'all'
          ? `https://fakestoreapi.com/products/category/${category}`
          : 'https://fakestoreapi.com/products'
      const res = await $fetch(url)
      products.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
  }
}
