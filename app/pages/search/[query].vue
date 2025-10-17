<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const route = useRoute()
const { products, loading, fetchProducts } = useProducts()

const searchQuery = ref(decodeURIComponent(route.params.query as string))

// Load all products on mount
onMounted(async () => {
  await fetchProducts()
})

// Watch for route changes (if user searches again)
watch(
  () => route.params.query,
  (newQuery) => {
    searchQuery.value = decodeURIComponent(newQuery as string)
  }
)

// Filter products by search query
const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter((p) => p.title.toLowerCase().includes(q))
})
</script>

<template>
    <div class="min-h-screen bg-white py-4">
        <div class="container mx-auto">
            <div class="mb-6">
                <b class="text-2xl capitalize">Search Results for "{{ searchQuery }}"</b>
            </div>

            <div v-if="loading" class="text-gray-500 text-center py-10">
                Loading products...
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-gray-500 text-center py-10">
                No products found.
            </div>

            <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="product in filteredProducts" :key="product.id"
                    class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
                    <img :src="product.image" alt="product.title" class="w-full h-48 object-contain p-4 bg-gray-100" />
                    <div class="p-4">
                        <h2 class="text-lg font-semibold mb-2 truncate">{{ product.title }}</h2>
                        <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ product.description }}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-bold text-green-600">${{ product.price }}</span>
                            <span class="text-sm text-gray-500 capitalize">{{ product.category }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
