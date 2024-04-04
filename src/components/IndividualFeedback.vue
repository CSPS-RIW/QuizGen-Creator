<template>
    <label :for="`indFeedback_${index}`">Option {{ index }} feedback: </label><input type="text" :id="`indFeedback_${index}`">
</template>
<script setup>
    defineProps({
        index: Number
    })
</script>

<style scoped lang="scss">

</style>