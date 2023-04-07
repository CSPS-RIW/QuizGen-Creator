<template>
    <div>
      <div>
        <span
          v-for="(part, index) in generateDisplayedFillInBlanks"
          :key="index"
        >
          <select
            v-if="part.isSelect"
            @change="onSelect($event, part.index)"
          >
            <option
              v-for="(option, optionIndex) in part.options"
              :key="optionIndex"
              :value="optionIndex"
              :disabled="optionIndex==0"
              :selected="optionIndex==0"
            >
              {{ option }}
            </option>
          </select>
          <template v-else>
            {{ part.content }}
          </template>
        </span>
      </div>
      <button @click="submitAnswers">Submit</button>
      <p v-if="submitted && correct">{{ question.correct_feedback }}</p>
      <p v-if="submitted && !correct">{{ question.incorrect_feedback }}</p>
      <p v-if="submitted">{{ question.generic_feedback }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ["question"],
    data() {
      return {
        userAnswers: [],
        submitted: false,
        correct: false,
      };
    },
    computed: {
      generateDisplayedFillInBlanks() {
        if (!this.question.question_text || !this.question.answer_options) {
          return [];
        }
  
        const parts = [];
        const splits = this.question.question_text.split("___");
        const numOptions = this.question.answer_options.length;
  
        for (let i = 0; i < splits.length; i++) {
          parts.push({ isSelect: false, content: splits[i] });
  
          if (i < numOptions) {
            const options = this.question.answer_options[i];
            parts.push({
              isSelect: true,
              index: i,
              options: options.options,
            });
          }
        }
  
        return parts;
      },
    },
    methods: {
      onSelect(event, index) {
        this.userAnswers[index] = parseInt(event.target.value);
      },
      submitAnswers() {
        this.submitted = true;
        this.correct = this.question.answer_options.every(
          (options, index) => options.correctIndex === this.userAnswers[index]
        );
      },
    },
  };
  </script>
  