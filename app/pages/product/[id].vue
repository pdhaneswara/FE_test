<!-- pages/product/[id].vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from 'ofetch'
import { useMobileMenu } from '../../composables/useMobileMenu'

const route = useRoute()
const router = useRouter()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const { isMobileMenuOpen } = useMobileMenu()

// Fetch product details
const fetchProduct = async () => {
  try {
    loading.value = true
    const res = await $fetch(`https://fakestoreapi.com/products/${route.params.id}`)
    product.value = res
  } catch (err) {
    error.value = 'Failed to fetch product.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)
</script>

<template>
  <div class="bg-white dark:bg-gray-900 py-4 transition-colors duration-300">
    <div class="container mx-auto px-3 lg:px-0">

      <!-- Breadcrumb -->
      <nav class="text-sm mb-6 text-gray-500 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">Home</NuxtLink>
        <span v-if="product" class="mx-2">›</span>
        <NuxtLink
          v-if="product"
          :to="`/category/${product.category}`"
          class="capitalize hover:text-blue-600 dark:hover:text-blue-400"
        >
          {{ product.category }}
        </NuxtLink>
        <span v-if="product" class="mx-2">›</span>
        <span
          v-if="product"
          class="text-gray-700 dark:text-gray-200 font-medium truncate inline-block max-w-[300px] align-middle"
        >
          {{ product.title }}
        </span>
      </nav>

      <!-- Loading & Error States -->
      <div v-if="loading" class="text-center py-20 text-gray-500 dark:text-gray-400">
        Loading product...
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-500 dark:text-red-400">
        {{ error }}
      </div>

      <!-- 🛍 Product Content -->
      <div v-else class="grid md:grid-cols-5 gap-10">
        <!-- Product Image -->
        <div
          class="flex justify-center items-center bg-gray-100 dark:bg-neutral-800 rounded-lg p-6 md:col-span-2 transition-colors duration-300"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="object-contain h-80 w-full"
          />
        </div>

        <!-- Product Details -->
        <div class="md:col-span-3">
          <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {{ product.title }}
          </h1>

          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {{ product.description }}
          </p>

          <div class="flex items-center justify-between mb-6">
            <span class="text-3xl font-semibold text-green-600 dark:text-green-500">
              ${{ product.price }}
            </span>
          </div>

          <div class="flex items-center mb-6">
            <span class="text-yellow-500 text-3xl mr-2">&#9733;</span>
            <span class="text-gray-700 dark:text-gray-200 font-medium">
              {{ product.rating?.rate }} / 5 ({{ product.rating?.count }} reviews)
            </span>
          </div>

          <!-- CTA Button -->
          <div v-if="!isMobileMenuOpen" class="flex gap-4">
            <button
              disabled
              class="bg-gray-400 dark:bg-gray-600 text-white px-6 py-2 rounded-lg transition w-full cursor-not-allowed opacity-70"
            >
              Sold Out!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

