<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { usePagination } from '../composables/usePagination'

const router = useRouter()
const route = useRoute()
const { products, loading, fetchProducts } = useProducts()
const selectedCategory = ref('all')
const perPage = 20

onMounted(async () => {
  await fetchProducts()
})

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
    <div>
        <!-- Hero section -->
        <div class="bg-white dark:bg-neutral-900 py-4 transition-colors duration-300">
            <div class="container mx-auto">
                <img src="https://picsum.photos/id/10/1200/400" alt="home"
                    class="w-full rounded-none md:rounded-lg overflow-hidden" />
            </div>
        </div>

        <!-- Product section -->
        <div class="bg-white dark:bg-neutral-900 py-4 mt-4 transition-colors duration-300">
            <div class="container mx-auto px-3 lg:px-0">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-lg md:text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">
                        All Products
                    </h1>

                    <!-- Category Dropdown -->
                    <div>
                        <CategoryDropdown v-model:selectedCategory="selectedCategory" />
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="text-gray-500 dark:text-gray-400 text-center py-10">
                    Loading...
                </div>

                <!-- Product Grid -->
                <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <NuxtLink v-for="product in paginatedProducts" :key="product.id" :to="`/product/${product.id}`"
                        class="bg-white dark:bg-neutral-800 shadow-md dark:shadow-none rounded-lg overflow-hidden hover:shadow-xl dark:hover:shadow-md dark:hover:shadow-gray-700 transition">
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
                <BasePagination :total="products.length" :per-page="perPage" :current-page="currentPage"
                    @update:page="updatePage" class="mt-8" />
            </div>
        </div>
    </div>
</template>
