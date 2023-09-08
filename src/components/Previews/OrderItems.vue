<template>
    <div class="order-items" tabindex="0">
        <p>{{ items.question_text }}</p>
        <transition-group name="slide">
            <div v-for="(item, index) in orderedItems" :key="item">
                <button @click="moveUp(index)" :disabled="index === 0">▲</button>
                {{ item }}
                <button @click="moveDown(index)" :disabled="index === orderedItems.length - 1"><svg><use href="#downArrow"></use></svg></button>
            </div>
        </transition-group>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="35.5" height="35.5" viewBox="0 0 35.5 35.5" style="display:none">
  <defs>
    <symbol id="downArrow"><path id="Icon_ionic-ios-arrow-dropup-circle" data-name="Icon ionic-ios-arrow-dropup-circle" d="M21.125,3.375a17.75,17.75,0,1,0,17.75,17.75A17.747,17.747,0,0,0,21.125,3.375Zm0,20.865,6.921-6.989a1.647,1.647,0,0,1,2.33,2.33l-8.167,8.141a1.645,1.645,0,0,1-2.27.051l-8.047-8.022a1.644,1.644,0,1,1,2.321-2.33Z" transform="translate(-3.375 -3.375)" fill="#4e5b73"/></symbol>
  </defs>
        
</svg>
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

.order-items div {
    min-height: 3em;
    background-color: #fff;
    border: 2px solid #707070;
    border-radius: 10px;
    padding: 0.25em 1.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.2em;
    line-height: 1.2;
    text-align: center;
}

.order-items {
    margin:auto;
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: .5em;
}


/* target transform only */
.slide-move {
    transition: transform .4s
}
</style>