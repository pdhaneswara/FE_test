<template>
    <div class="flex flex-col h-screen">
        <base-navigation />
        <div class="flex-1 bg-neutral-100">
            <div>
                <slot />
            </div>
        </div>
        <base-footer />
    </div>
</template>

<script setup lang="ts"></script>