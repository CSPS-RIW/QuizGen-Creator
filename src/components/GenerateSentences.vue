<template>
  <div>
    <h2>{{ $t("inputTitle") }}</h2>
    <textarea class="inputTitle" v-model="text" @input="processText"></textarea>
    <h2>{{ $t("clickToSelect") }}</h2>
    <div v-for="(sentence, index) in sentences" :key="index">
      <span
        :class="{ highlighted: isHighlighted(index) }"
        @click="selectSentence(index)"
        tabindex="0"
        >{{ sentence.text }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  emits: ["update:activity"],
  props: ["loadedJson"],
  data() {
    return {
      text: this.loadedJson.question_text || "",
      sentences: [],
      correctIndices: this.loadedJson.correct_answer || [],
      loadingFromJson: false,
    };
  },
  methods: {
    processText() {
      // if (this.loadingFromJson) return;

      this.sentences = this.text
        .replace(/\n+/g, " ")
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s)
        .map((s) => ({ text: s.trim() + "" }));
    },
    isHighlighted(index) {
      return this.correctIndices.includes(index);
    },
    selectSentence(index) {
      const isSelected = this.isHighlighted(index);
      if (isSelected) {
        this.correctIndices.splice(this.correctIndices.indexOf(index), 1);
      } else {
        this.correctIndices.push(index);
      }
    },
  },
  watch: {
    correctIndices: {
      handler(newVal, oldVal) {
        this.$emit("update:activity", {
          text: this.text,
          correct_answer: this.correctIndices,
        });
      },
      deep: true,
      immediate: true,
    },
    loadedJson: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.loadingFromJson = true;

          this.text = newVal.question_text;
          this.correctIndices = newVal.correct_answer;
          this.processText();

          this.loadingFromJson = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
.highlighted {
  background-color: rgb(255, 255, 220);
  outline: 1px dashed black;
}
textarea.inputTitle {
  width: 100%;
  height: 200px;
}
</style>
