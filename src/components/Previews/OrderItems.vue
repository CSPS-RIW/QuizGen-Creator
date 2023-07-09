<template>
    <div class="order-items" tabindex="0">
        <p>{{ items.question_text }}</p>
        <transition-group name="slide">
            <div v-for="(item, index) in orderedItems" :key="item">
                <button @click="moveUp(index)" :disabled="index === 0">▲</button>
                {{ item }}
                <button @click="moveDown(index)" :disabled="index === orderedItems.length - 1">▼</button>
            </div>
        </transition-group>
    </div>
</template>
  
<script>
export default {
    name: "OrderItems",
    props: {
        items: Object
    },
    data() {
        return {
            orderedItems: [...this.items.answer_options]
        }
    },
    watch: {
        'items.answer_options': {
            deep: true,
            handler(newValue) {
                this.orderedItems = [...newValue]
            },
        }
    },
    methods: {
        moveUp(index) {
            if (index > 0) {
                [this.orderedItems[index], this.orderedItems[index - 1]] = [this.orderedItems[index - 1], this.orderedItems[index]];
                this.$emit('order-changed', this.orderedItems);
            }
        },
        moveDown(index) {
            if (index < this.orderedItems.length - 1) {
                [this.orderedItems[index], this.orderedItems[index + 1]] = [this.orderedItems[index + 1], this.orderedItems[index]];
                this.$emit('order-changed', this.orderedItems);
            }
        }
    }
}
</script>
  
<style scoped>
button:disabled {
    opacity: 0.5;
    cursor: default;
}


/* target transform only */
.slide-move {
    transition: transform .4s
}
</style>