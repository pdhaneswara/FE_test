<!-- pages/product/[id].vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from 'ofetch'

const route = useRoute()
const router = useRouter()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')

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
  <div class="bg-white py-4">
    <div class="container mx-auto px-3 lg:px-0">

      <!-- Breadcrumb -->
      <nav class="text-sm mb-6 text-gray-500">
        <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
        <span v-if="product" class="mx-2">›</span>
        <NuxtLink
          v-if="product"
          :to="`/category/${product.category}`"
          class="capitalize hover:text-blue-600"
        >
          {{ product.category }}
        </NuxtLink>
        <span v-if="product" class="mx-2">›</span>
        <span v-if="product" class="text-gray-700 font-medium truncate inline-block max-w-[300px] align-middle">
          {{ product.title }}
        </span>
      </nav>

      <div v-if="loading" class="text-center py-20 text-gray-500">Loading product...</div>
      <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

      <div v-else class="grid md:grid-cols-5 gap-10">
        <!-- Product Image -->
        <div class="flex justify-center items-center bg-gray-100 rounded-lg p-6 md:col-span-2">
          <img
            :src="product.image"
            :alt="product.title"
            class="object-contain h-80 w-full"
          />
        </div>

        <!-- Product Details -->
        <div class="md:col-span-3">
          <h1 class="text-2xl font-bold mb-4 text-gray-800">
            {{ product.title }}
          </h1>

          <p class="text-gray-600 mb-6 leading-relaxed">{{ product.description }}</p>

          <div class="flex items-center justify-between mb-6">
            <span class="text-3xl font-semibold text-green-600">${{ product.price }}</span>
            <!-- <span
              class="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize"
            >
              {{ product.category }}
            </span> -->
          </div>

          <div class="flex items-center mb-6">
            <span class="text-yellow-500 text-3xl mr-2">&#9733;</span>
            <span class="text-gray-700 font-medium">
              {{ product.rating?.rate }} / 5 ({{ product.rating?.count }} reviews)
            </span>
          </div>

          <div class="flex gap-4">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition w-full"
            >
              Sold Out!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
