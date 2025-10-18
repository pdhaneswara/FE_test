<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useMobileMenu } from '../composables/useMobileMenu'
import { useDarkMode } from '../composables/useDarkMode'

const router = useRouter()
const { products, fetchProducts } = useProducts()

const { isMobileMenuOpen, toggleMenu, closeMenu } = useMobileMenu() // use shared menu state
const searchQuery = ref('')
const showSuggestions = ref(false)
const { isDarkMode, toggleDarkMode } = useDarkMode()

onMounted(async () => {
  await fetchProducts()
})

// --- Lock scroll when menu open ---
watch(isMobileMenuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
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

  router.push(`/search/${encodeURIComponent(finalQuery)}`)

  // Reset search input and hide suggestions
  searchQuery.value = ''
  showSuggestions.value = false
  closeMenu() // closes menu if on mobile
}

// Hide suggestions when clicking outside
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<template>
  <header
    class="py-4 header-shadow sticky top-0 bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300"
  >
    <nav class="flex container mx-auto items-center justify-between px-3 lg:px-0">
      <!-- Logo + Links -->
      <div class="hidden md:flex items-center">
        <NuxtLink to="/" class="flex gap-1 items-center">
          <NuxtImg width="56px" src="/icon-green.png" format="webp" alt="logo" />
          <span class="hidden md:block lg:text-3xl md:text-2xl font-bold">Nuxt Stores</span>
        </NuxtLink>

        <ul class="flex items-center gap-2 lg:gap-6 mx-4 lg:mx-6 capitalize">
          <li><NuxtLink to="/category/men's%20clothing">Men</NuxtLink></li>
          <li><NuxtLink to="/category/women's%20clothing">Women</NuxtLink></li>
          <li><NuxtLink to="/category/jewelery">Jewelry</NuxtLink></li>
          <li><NuxtLink to="/category/electronics">Electronic</NuxtLink></li>
        </ul>
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="hidden md:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span v-if="isDarkMode">&#127769;</span>
          <span v-else>&#9728;&#65039;</span>
        </button>
      </div>      

      <!-- Search Bar -->
      <div class="relative w-full md:w-auto mr-3 md:mr-0">
        <input
          v-model="searchQuery"
          @focus="showSuggestions = true"
          @blur="handleBlur"
          @keyup.enter="handleSearch()"
          type="text"
          placeholder="Search for products..."
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
                 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-blue-400
                 transition-colors duration-300"
        />

        <!-- Autofill Suggestions -->
        <ul
          v-if="showSuggestions && suggestions.length"
          class="absolute z-50 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700
                 w-full mt-1 rounded-lg shadow-lg overflow-hidden transition-colors duration-300"
        >
          <li
            v-for="item in suggestions"
            :key="item.id"
            @mousedown.prevent="handleSearch(item.title)"
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer
                   text-gray-700 dark:text-gray-200 text-sm transition-colors duration-200"
          >
            {{ item.title }}
          </li>
          <li
            v-if="!suggestions.length && searchQuery"
            class="px-4 py-2 text-gray-400 dark:text-gray-500"
          >
            No matches found
          </li>
        </ul>
      </div>

      <!-- Hamburger -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        @click="toggleMenu"
      >
        <span
          class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-100 transition-all duration-300"
          :class="isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''"
        ></span>
        <span
          class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-100 mt-1 transition-all duration-300"
          :class="isMobileMenuOpen ? 'opacity-0' : ''"
        ></span>
        <span
          class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-100 mt-1 transition-all duration-300"
          :class="isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"
        ></span>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-white dark:bg-gray-900 dark:text-white z-50 flex flex-col items-center justify-start p-6 overflow-y-auto transition-colors duration-300"
      >
        <!-- Close Button -->
        <button
          @click="closeMenu"
          class="absolute top-4 right-4 text-3xl font-bold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all"
        >
          &#10006;
        </button>

        <div class="mb-6 mt-10">
          <NuxtImg width="90px" src="/icon-green.png" format="webp" alt="logo" class="mx-auto" />
          <span class="lg:text-3xl md:text-2xl font-bold">Nuxt Stores</span>
        </div>

        <!-- Links -->
        <div class="flex flex-col items-center gap-5 text-xl font-medium text-gray-700 dark:text-gray-300">
          <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/category/electronics" class="hover:text-blue-600 dark:hover:text-blue-400" @click="closeMenu">Electronics</NuxtLink>
          <NuxtLink to="/category/jewelery" class="hover:text-blue-600 dark:hover:text-blue-400" @click="closeMenu">Jewelery</NuxtLink>
          <NuxtLink to="/category/men's clothing" class="hover:text-blue-600 dark:hover:text-blue-400" @click="closeMenu">Men</NuxtLink>
          <NuxtLink to="/category/women's clothing" class="hover:text-blue-600 dark:hover:text-blue-400" @click="closeMenu">Women</NuxtLink>
        </div>

        <!-- Dark Mode Toggle (Mobile) -->
        <button
          @click="toggleDarkMode"
          class="mt-8 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <span v-if="isDarkMode">&#127769; Dark Mode</span>
          <span v-else>&#9728;&#65039; Light Mode</span>
        </button>
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
