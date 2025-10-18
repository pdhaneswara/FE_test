<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<template>
    <footer class="py-3 bg-neutral-800 text-white hidden md:block">
        <nav class="flex container mx-auto items-center px-3 lg:px-0">
            <div><span>&#169;</span> {{ currentYear }} Nuxt Stores. All rights reserved.</div>
        </nav>
    </footer>
</template>