<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  perPage?: number
  currentPage: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:page'])

const perPage = computed(() => props.perPage || 4)
const totalPages = computed(() => Math.ceil(props.total / perPage.value))

const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= totalPages.value; i++) arr.push(i)
  return arr
})

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:page', page)
}
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-wrap justify-center items-center gap-2 mt-6 select-none"
  >
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 border rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="[
        'px-3 py-1 border rounded-lg text-sm font-medium hover:bg-blue-100 transition',
        currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-700'
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 border rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>
