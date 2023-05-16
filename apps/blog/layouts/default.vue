<template>
    <div>
        <GlobalHeader></GlobalHeader>
        <!-- <transition name="fade">
          
        </transition> -->
        <Toast></Toast>
        <slot />
        <GlobalFooter></GlobalFooter>
    </div>
</template>
<script lang="ts" setup>
// const { toastVisible, showToast, toastType } = useToast()
</script>
