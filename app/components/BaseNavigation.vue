<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { products, fetchProducts } = useProducts()

const searchQuery = ref('')
const showSuggestions = ref(false)
const isMobileMenuOpen = ref(false)

onMounted(async () => {
  await fetchProducts()
})

// --- Lock scroll when menu open ---
watch(isMobileMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
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

  // Reset search input and hide suggestions
  searchQuery.value = ''
  showSuggestions.value = false
  isMobileMenuOpen.value = false
}

// Hide suggestions when clicking outside
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const closeMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="py-4 header-shadow sticky top-0 bg-white">
    <nav class="flex container mx-auto items-center justify-between px-3 lg:px-0">
      <div class="hidden md:flex items-center">
        <NuxtLink to="/" class="flex gap-1 items-center">
          <NuxtImg width="56px" src="/icon-green.png" format="webp" alt="" />
          <span class="hidden md:block lg:text-3xl md:text-2xl font-bold">Nuxt Stores</span>
        </NuxtLink>
        <ul class="flex items-center gap-2 lg:gap-6 mx-4 lg:mx-6 capitalize">
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
      <div class="relative w-full md:w-auto mr-3 md:mr-0">
        <!-- Search Input -->
        <input v-model="searchQuery" @focus="showSuggestions = true" @blur="handleBlur" @keyup.enter="handleSearch()"
          type="text" placeholder="Search for products..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <!-- Autofill Suggestions -->
        <ul v-if="showSuggestions && suggestions.length"
          class="absolute z-50 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg overflow-hidden">
          <li v-for="item in suggestions" :key="item.id" @mousedown.prevent="handleSearch(item.title)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm">
            {{ item.title }}
          </li>
          <li v-if="!suggestions.length && searchQuery" class="px-4 py-2 text-gray-400">
            No matches found
          </li>
        </ul>
      </div>
      <button class="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="block w-6 h-0.5 bg-gray-800 transition-all duration-300"
          :class="isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''"></span>
        <span class="block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300"
          :class="isMobileMenuOpen ? 'opacity-0' : ''"></span>
        <span class="block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300"
          :class="isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"></span>
      </button>
    </nav>
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start p-6 overflow-y-auto"
      >
        <!-- Close Button -->
        <button
          @click="isMobileMenuOpen = false"
          class="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800 transition-all"
        >
          ×
        </button>

        <NuxtLink to="/" class="mb-6">
          <NuxtImg width="90px" src="/icon-green.png" format="webp" alt="" class="mx-auto" />
          <span class="lg:text-3xl md:text-2xl font-bold">Nuxt Stores</span>
        </NuxtLink>

        <!-- Links -->
        <div class="flex flex-col items-center gap-5 text-xl font-medium text-gray-700">
          <NuxtLink to="/" class="hover:text-blue-600" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/category/electronics" class="hover:text-blue-600" @click="closeMenu">Electronics</NuxtLink>
          <NuxtLink to="/category/jewelery" class="hover:text-blue-600" @click="closeMenu">Jewelery</NuxtLink>
          <NuxtLink to="/category/men's clothing" class="hover:text-blue-600" @click="closeMenu">Men</NuxtLink>
          <NuxtLink to="/category/women's clothing" class="hover:text-blue-600" @click="closeMenu">Women</NuxtLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>