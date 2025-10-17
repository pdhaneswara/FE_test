<template>
  <header class="py-4 header-shadow">
    <nav class="flex container mx-auto items-center">
      <NuxtLink to="/" class="flex gap-1 items-center">
        <span class="text-3xl font-bold text-orange-600">Orange Store</span>
      </NuxtLink>
      <ul class="flex items-center gap-6 ml-auto capitalize">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin">Admin</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>