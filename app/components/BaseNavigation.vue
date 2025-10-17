<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { products, fetchProducts } = useProducts()

const searchQuery = ref('')
const showSuggestions = ref(false)

onMounted(async () => {
  await fetchProducts()
})

// Filter suggestions dynamically
const suggestions = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return products.value
    .filter((p) => p.title.toLowerCase().includes(q))
    .slice(0, 5) // show only 5 suggestions
})

// Handle search submit (Enter key or click on suggestion)
const handleSearch = (query?: string) => {
  const finalQuery = query || searchQuery.value.trim()
  if (!finalQuery) return

  // Navigate to /search/:query
  router.push(`/search/${encodeURIComponent(finalQuery)}`)

  // ✅ Reset search input and hide suggestions
  searchQuery.value = ''
  showSuggestions.value = false
}

// Hide suggestions when clicking outside
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<template>
  <header class="py-4 header-shadow sticky top-0 bg-white">
    <nav class="flex container mx-auto items-center">
      <div class="flex items-center">
        <NuxtLink to="/" class="flex gap-1 items-center">
          <NuxtImg width="56px" src="/icon-green.png" format="webp" alt="" />
          <span class="text-3xl font-bold">Nuxt Stores</span>
        </NuxtLink>
        <ul class="flex items-center gap-6 ml-4 capitalize">
          <li>
            <NuxtLink to="/category/men's%20clothing">Men</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/category/women's%20clothing">Women</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/category/jewelery">Jewelry</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/category/electronics">Electronic</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="relative ml-auto">
      <!-- Search Input -->
      <input
        v-model="searchQuery"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keyup.enter="handleSearch()"
        type="text"
        placeholder="Search for products..."
        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Autofill Suggestions -->
      <ul
        v-if="showSuggestions && suggestions.length"
        class="absolute z-50 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg overflow-hidden"
      >
        <li
          v-for="item in suggestions"
          :key="item.id"
          @mousedown.prevent="handleSearch(item.title)"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
        >
          {{ item.title }}
        </li>
        <li v-if="!suggestions.length && searchQuery" class="px-4 py-2 text-gray-400">
          No matches found
        </li>
      </ul>
    </div>
    </nav>
  </header>
</template>