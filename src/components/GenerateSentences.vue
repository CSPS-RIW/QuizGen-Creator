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
      text: "",
      sentences: [],
      correctIndices: [],
    };
  },
  methods: {
    processText() {
      this.sentences = this.text
        .replace(/\n+/g, " ")
        .split(/(?<=[.!?])\s+/) // Split the text using a regex that matches spaces following a period, exclamation point, or question mark
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
    downloadFile() {
      const fileContent = {
        text: this.sentences.map((s) => s.text).join(" "),
        "correct-indices": this.correctIndices,
      };
      const jsonString = JSON.stringify(fileContent);
      const doubleEncodedJson = JSON.stringify(jsonString);

      const blob = new Blob([doubleEncodedJson], {
        type: "text/plain;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `sentences_${this.$i18n.locale}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
  watch: {
    correctIndices: {
      handler(newVal, oldVal) {
        this.$emit("update:activity", {
          text: this.text,
          "correct_answer": this.correctIndices,
        });
      },
      deep: true,
      immediate: true,
    },
    loadedJson: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.text = newVal.question_text;
          this.correctIndices = newVal.correct_answer;
          this.processText();
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
  background-color: yellow;
  outline: 1px solid black;
}
textarea.inputTitle {
  width: 100%;
  height: 200px;
}
</style>
