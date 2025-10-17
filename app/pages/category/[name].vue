<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const route = useRoute()
const { products, loading, fetchProducts } = useProducts()

const selectedCategory = ref(route.params.name as string)

onMounted(async () => {
  await fetchProducts(selectedCategory.value)
})

const pageSize = 8
const currentPage = ref(1)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return products.value.slice(start, start + pageSize)
})

const displayStart = computed(() =>
  products.value.length ? (currentPage.value - 1) * pageSize + 1 : 0
)
const displayEnd = computed(() =>
  Math.min(currentPage.value * pageSize, products.value.length)
)
</script>

<template>
    <div class="bg-white py-4">
        <div class="container mx-auto">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <b class="text-2xl capitalize">{{ selectedCategory }} Product</b>
                    <p v-if="!loading && products.length" class="text-gray-600 text-sm">
                        Displaying <b>{{ displayStart }}</b> - <b>{{ displayEnd }}</b> of
                        <b>{{ products.length }}</b> products
                    </p>
                </div>
                <CategoryDropdown v-model:selectedCategory="selectedCategory" />
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-gray-500 text-center py-10">Loading...</div>

            <!-- Product Grid -->
            <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="product in products" :key="product.id"
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
