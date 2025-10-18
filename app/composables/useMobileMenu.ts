import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

export function useMobileMenu() {
  const openMenu = () => (isMobileMenuOpen.value = true)
  const closeMenu = () => (isMobileMenuOpen.value = false)
  const toggleMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value)

  return { isMobileMenuOpen, openMenu, closeMenu, toggleMenu }
}
