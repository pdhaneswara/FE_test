<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../composables/useProducts'
import { usePagination } from '../../composables/usePagination'

const route = useRoute()
const { products, loading, fetchProducts } = useProducts()

const searchQuery = ref(decodeURIComponent(route.params.query as string))
const selectedCategory = ref('all')
const perPage = 20

onMounted(async () => {
  await fetchProducts()
})

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

//  usePagination composable
const {
  currentPage,
  updatePage,
  paginatedItems: paginatedProducts,
  displayStart,
  displayEnd,
  sortOption,
  updateSort,
} = usePagination(filteredProducts, perPage)
</script>

<template>
  <div class="bg-white py-4">
    <div class="container mx-auto px-3 lg:px-0">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-lg md:text-2xl font-bold capitalize">Search Results for "{{ searchQuery }}"</h1>
          <p v-if="!loading && filteredProducts.length" class="text-gray-600 text-sm">
            Displaying
            <b class="text-emerald-500">{{ displayStart }}</b> -
            <b class="text-emerald-500">{{ displayEnd }}</b> of
            <b class="text-emerald-500">{{ filteredProducts.length }}</b>
            products
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-gray-500 text-center py-10">
        Loading products...
      </div>

      <!-- No Results -->
      <div v-else-if="filteredProducts.length === 0" class="text-gray-500 text-center py-10">
        No products found.
      </div>

      <!-- Product Grid -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="product in paginatedProducts" :key="product.id"
          class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          :to="`/product/${product.id}`">
          <img :src="product.image" alt="product.title" class="w-full h-48 object-contain p-4 bg-gray-100" />
          <div class="p-4">
            <h2 class="text-lg font-semibold mb-1 truncate">{{ product.title }}</h2>
            <div class="flex items-center">
                <span class="text-yellow-500 text-lg mr-1">&#9733;</span>
                <span class="text-gray-700 font-medium text-sm">
                {{ product.rating?.rate }}
                </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-green-600">${{ product.price }}</span>
              <span class="text-sm text-gray-500 capitalize">{{ product.category }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <BasePagination
        :total="filteredProducts.length"
        :per-page="perPage"
        :current-page="currentPage"
        @update:page="updatePage"
        class="mt-8"
      />
    </div>
  </div>
</template>
