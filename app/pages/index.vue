<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import { useCategories } from '../composables/useCategories'

const { products, loading: loadingProducts, fetchProducts } = useProducts()
const { categories, loading: loadingCategories, fetchCategories } = useCategories()

const selectedCategory = ref('all')

// Fetch on mount
onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})

// Handle category change
const handleCategoryChange = async (e: Event) => {
  selectedCategory.value = (e.target as HTMLSelectElement).value
  await fetchProducts(selectedCategory.value)
}
</script>

<template>
    <div>
        <div class="bg-white py-4">
            <div class="container mx-auto">
                <img src="https://picsum.photos/id/10/1200/400" alt="home" class="w-full" />
            </div>
        </div>
        <div class="bg-white py-4 mt-4">
            <div class="container mx-auto">
                <div class="flex items-center justify-between">
                    <b class="text-2xl">All Product</b>
                    <!-- Category Dropdown -->
                    <div class="mb-6">
                        <select
                        class="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                        @change="handleCategoryChange"
                        >
                        <option value="all">All Categories</option>
                        <option
                            v-for="cat in categories"
                            :key="cat"
                            :value="cat"
                        >
                            {{ cat }}
                        </option>
                        </select>
                    </div>
                </div>
                <!-- <div class="grid grid-cols-4 gap-4 mt-4">
                    <div 
                        v-for="product in products"
                        :key="product.id"
                    >01</div>
                </div> -->
                <!-- Loading -->
                <div v-if="loadingProducts || loadingCategories" class="text-gray-500 text-center py-10">
                    Loading...
                </div>
                <!-- Product Grid -->
                <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div
                    v-for="product in products"
                    :key="product.id"
                    class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>