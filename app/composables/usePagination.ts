// composables/usePagination.ts
import { ref, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function usePagination<T extends Record<string, any>>(items: Ref<T[]>, perPage = 4) {
  const route = useRoute()
  const router = useRouter()

  const currentPage = ref(Number(route.query.page) || 1)
  const sortOption = ref<'default' | 'priceAsc' | 'priceDesc' | 'ratingAsc' | 'ratingDesc'>('default')

  // Watch for page query changes
  watch(
    () => route.query.page,
    (newVal) => {
      currentPage.value = Number(newVal) || 1
    }
  )

  // Update page in URL
  watch(currentPage, (val) => {
    router.replace({
      query: { ...route.query, page: val === 1 ? undefined : val },
    })
  })

  const updatePage = (p: number) => {
    currentPage.value = p
  }

  const updateSort = (
    option: 'default' | 'priceAsc' | 'priceDesc' | 'ratingAsc' | 'ratingDesc'
  ) => {
    sortOption.value = option
    currentPage.value = 1 // reset to first page when sorting changes
  }

  const sortedItems = computed(() => {
    const arr = [...items.value]
    switch (sortOption.value) {
      case 'priceAsc':
        return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      case 'priceDesc':
        return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      case 'ratingAsc':
        return arr.sort((a, b) => (a.rating?.rate ?? 0) - (b.rating?.rate ?? 0))
      case 'ratingDesc':
        return arr.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
      default:
        return arr
    }
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return sortedItems.value.slice(start, start + perPage)
  })

  const displayStart = computed(() =>
    sortedItems.value.length ? (currentPage.value - 1) * perPage + 1 : 0
  )

  const displayEnd = computed(() =>
    Math.min(currentPage.value * perPage, sortedItems.value.length)
  )

  return {
    currentPage,
    updatePage,
    paginatedItems,
    displayStart,
    displayEnd,
    sortOption,
    updateSort,
  }
}
