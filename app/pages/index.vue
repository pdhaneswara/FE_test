<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProducts } from '../composables/useProducts'

const { products, loading, fetchProducts } = useProducts()
const selectedCategory = ref('all')

onMounted(async () => {
  await fetchProducts()
})
</script>

<template>
    <div>
        <div class="bg-white py-4">
            <div class="container mx-auto">
                <img src="https://picsum.photos/id/10/1200/400" alt="home" class="w-full rounded-none md:rounded-lg overflow-hidden" />
            </div>
        </div>
        <div class="bg-white py-4 mt-4">
            <div class="container mx-auto px-3 lg:px-0">
                <div class="flex items-center justify-between mb-6">
                    <b class="text-2xl">All Product</b>

                    <!-- Category Dropdown -->
                    <div>
                        <CategoryDropdown v-model:selectedCategory="selectedCategory" />
                    </div>
                </div>
                <!-- Loading -->
                <div v-if="loading" class="text-gray-500 text-center py-10">Loading...</div>
                <!-- Product Grid -->
                <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <NuxtLink
                        v-for="product in products"
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
            </div>
        </div>
    </div>
</template>