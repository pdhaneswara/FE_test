<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '../composables/useCategories'

const props = defineProps<{
  selectedCategory?: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void
}>()

const router = useRouter()
const { categories, fetchCategories } = useCategories()

const localCategory = ref(props.selectedCategory || 'all')

// Fetch categories from API
onMounted(async () => {
  await fetchCategories()
})

// Watch for manual dropdown changes
const handleCategoryChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  localCategory.value = value
  emit('update:selectedCategory', value)

  // Optional: automatically navigate when selected
  if (value === 'all') router.push('/')
  else router.push(`/category/${value}`)
}
</script>

<template>
  <select v-model="localCategory" @change="handleCategoryChange" class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-100
           bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400
           transition-colors duration-300 cursor-pointer">
    <option value="all">All Categories</option>
    <option v-for="cat in categories" :key="cat" :value="cat"
      class="capitalize bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-100">
      {{ cat }}
    </option>
  </select>
</template>

