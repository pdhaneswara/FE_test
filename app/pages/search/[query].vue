<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const route = useRoute()
const router = useRouter()

const { products, loading, fetchProducts } = useProducts()

const searchQuery = ref(decodeURIComponent(route.params.query as string))
const selectedCategory = ref('all')

// Fetch all products initially
onMounted(async () => {
  await fetchProducts()
})

// Re-run search when URL param changes
watch(
  () => route.params.query,
  async (newQuery) => {
    searchQuery.value = decodeURIComponent(newQuery as string)
    await fetchProducts()
  }
)

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  let list = products.value.filter((p) => p.title.toLowerCase().includes(q))

  if (selectedCategory.value !== 'all') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  return list
})

const pageSize = 8
const currentPage = ref(1)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const displayStart = computed(() =>
  filteredProducts.value.length ? (currentPage.value - 1) * pageSize + 1 : 0
)
const displayEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredProducts.value.length)
)
</script>

<template>
    <div class="bg-white py-4">
        <div class="container mx-auto px-4 lg:px-0">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <b class="text-2xl capitalize">Search Results for "{{ searchQuery }}"</b>
                    <p v-if="!loading && filteredProducts.length" class="text-gray-600 text-sm">
                        Displaying <b class="text-emerald-500">{{ displayStart }}</b> - <b class="text-emerald-500">{{ displayEnd }}</b> of
                        <b class="text-emerald-500">{{ filteredProducts.length }}</b> products
                    </p>
                </div>
            </div>

            <div v-if="loading" class="text-gray-500 text-center py-10">
                Loading products...
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-gray-500 text-center py-10">
                No products found.
            </div>

            <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <NuxtLink
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
                    :to="`/product/${product.id}`"
                >
                    <img :src="product.image" alt="product.title" class="w-full h-48 object-contain p-4 bg-gray-100" />
                    <div class="p-4">
                        <h2 class="text-lg font-semibold mb-2 truncate">{{ product.title }}</h2>
                        <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ product.description }}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-bold text-green-600">${{ product.price }}</span>
                            <span class="text-sm text-gray-500 capitalize">{{ product.category }}</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
