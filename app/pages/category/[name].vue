<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../../composables/useProducts'
import { usePagination } from '../../composables/usePagination'

const route = useRoute()
const router = useRouter()
const { products, loading, fetchProducts } = useProducts()

const selectedCategory = ref((route.params.name as string) || 'all')
const perPage = 20

// fetch products for initial category
onMounted(async () => {
  await fetchProducts(selectedCategory.value)
})

// re-fetch when the route param (category name) changes
watch(
  () => route.params.name,
  async (newName) => {
    const name = (newName as string) || 'all'
    selectedCategory.value = name
    // fetch products for the new category
    await fetchProducts(selectedCategory.value)

    // reset pagination to page 1 and clear ?page from URL
    updatePage(1)
    router.replace({ query: {} })
  }
)

// Use pagination composable (8 items per page)
const {
  currentPage,
  updatePage,
  paginatedItems: paginatedProducts,
  displayStart,
  displayEnd,
  sortOption,
  updateSort,
} = usePagination(products, perPage)
</script>

<template>
  <div class="bg-white py-4">
    <div class="container mx-auto px-3 lg:px-0">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold capitalize">{{ selectedCategory }} Products</h2>
          <p v-if="!loading && products.length" class="text-gray-600 text-sm">
            Displaying
            <b class="text-emerald-500">{{ displayStart }}</b> -
            <b class="text-emerald-500">{{ displayEnd }}</b> of
            <b class="text-emerald-500">{{ products.length }}</b>
            products
          </p>
        </div>

        <div class="flex gap-2 items-center">
          <!-- Category dropdown -->
          <CategoryDropdown v-model:selectedCategory="selectedCategory" />

          <!-- Sorting -->
          <select
            v-model="sortOption"
            @change="updateSort(sortOption)"
            class="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
          >
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-gray-500 text-center py-10">Loading...</div>

      <!-- Empty -->
      <div v-else-if="!paginatedProducts.length" class="text-gray-500 text-center py-10">
        No products found in this category.
      </div>

      <!-- Product Grid -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          :to="`/product/${product.id}`"
        >
          <img
            :src="product.image"
            alt="product.title"
            class="w-full h-48 object-contain p-4 bg-gray-100"
          />
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

      <!-- Pagination -->
      <BasePagination
        :total="products.length"
        :per-page="perPage"
        :current-page="currentPage"
        @update:page="updatePage"
        class="mt-8"
      />
    </div>
  </div>
</template>
