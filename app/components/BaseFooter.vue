<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<template>
    <footer class="py-3 bg-neutral-800 text-white">
        <nav class="flex container mx-auto items-center">
            <div><span>&#169;</span> {{ currentYear }} Orange Store. All rights reserved.</div>
            <ul class="flex items-center gap-6 ml-auto capitalize">
                <li>
                <NuxtLink to="/">Privacy policy</NuxtLink>
                </li>
                <li>
                <NuxtLink to="/about">Terms of Service</NuxtLink>
                </li>
                <li>
                <NuxtLink to="/admin">Contact Us</NuxtLink>
                </li>
            </ul>
        </nav>
    </footer>
</template>