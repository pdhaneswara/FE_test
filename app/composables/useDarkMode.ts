import { ref, watch, onMounted } from 'vue'

const isDarkMode = ref(false)

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  onMounted(() => {
    if (!import.meta.client) return // ✅ Works in Nuxt 3 with Vite

    const stored = localStorage.getItem('theme')
    if (stored) {
      isDarkMode.value = stored === 'dark'
    } else {
      // Default: follow system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme(isDarkMode.value)
  })

  const applyTheme = (val: boolean) => {
    if (!import.meta.client) return // ✅ guard again for SSR
    const html = document.documentElement
    if (val) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  watch(isDarkMode, (val) => applyTheme(val))

  return { isDarkMode, toggleDarkMode }
}
