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
  <div class="bg-white dark:bg-neutral-900 py-4">
    <div class="container mx-auto px-3 lg:px-0">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-lg md:text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">{{ selectedCategory }}
            Products</h1>
          <p v-if="!loading && products.length" class="text-gray-600 text-sm dark:text-gray-100">
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
          <select v-model="sortOption" @change="updateSort(sortOption)" class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-100
                  bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400
                  transition-colors duration-300 cursor-pointer">
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low &#8594; High</option>
            <option value="priceDesc">Price: High &#8594; Low</option>
            <option value="ratingAsc">Rating: Low &#8594; High</option>
            <option value="ratingDesc">Rating: High &#8594; Low</option>
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
        <NuxtLink v-for="product in paginatedProducts" :key="product.id"
          class="bg-white dark:bg-neutral-800 shadow-md dark:shadow-none rounded-lg overflow-hidden hover:shadow-xl dark:hover:shadow-md dark:hover:shadow-gray-700 transition"
          :to="`/product/${product.id}`">
          <img :src="product.image" alt="product.title"
            class="w-full h-48 object-contain p-4 bg-gray-100 dark:bg-neutral-700" />
          <div class="p-4">
            <h2 class="text-lg font-semibold mb-1 truncate text-gray-900 dark:text-gray-100">
              {{ product.title }}
            </h2>
            <div class="flex items-center">
              <span class="text-yellow-500 text-lg mr-1">&#9733;</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium text-sm">
                {{ product.rating?.rate }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-green-600 dark:text-green-400">
                ${{ product.price }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {{ product.category }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <BasePagination :total="products.length" :per-page="perPage" :current-page="currentPage" @update:page="updatePage"
        class="mt-8" />
    </div>
  </div>
</template>