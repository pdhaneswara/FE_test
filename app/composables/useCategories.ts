// composables/useCategories.ts
import { ref } from 'vue'
import { $fetch } from 'ofetch'

export function useCategories() {
  const categories = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('https://fakestoreapi.com/products/categories')
      categories.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to load categories'
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}
