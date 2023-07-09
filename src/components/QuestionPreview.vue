<template>
  <div class="preview">
    <div :class="[styleClass, 'question-preview']">
      <h6>Activity {{ index + 1 }} Preview</h6>
      <div>{{ question.instructions }}</div>
      <div v-if="question.question_type === 'single-select'">
        <p>{{ question.question_text }}</p>
        <div
          v-for="(option, optionIndex) in question.answer_options"
          :key="optionIndex"
        >
          <input
            type="radio"
            :name="'preview-question' + index + '-option'"
            :id="'preview-question' + index + '-option' + optionIndex"
            :checked="option.isCorrect"
            disabled
          />
          <label :for="'preview-question' + index + '-option' + optionIndex">{{
            option.text
          }}</label>
        </div>
      </div>
      <div v-else-if="question.question_type === 'multiple-select'">
        <p>{{ question.question_text }}</p>
        <div
          v-for="(option, optionIndex) in question.answer_options"
          :key="optionIndex"
        >
          <input
            type="checkbox"
            :id="'preview-question' + index + '-option' + optionIndex"
            :checked="option.isCorrect"
            disabled
          />
          <label :for="'preview-question' + index + '-option' + optionIndex">{{
            option.text
          }}</label>
        </div>
      </div>
      <div v-else-if="question.question_type === 'true-false'">
        <p>{{ question.question_text }}</p>
        <div
          v-for="(option, optionIndex) in question.answer_options"
          :key="optionIndex"
        >
          <input
            type="radio"
            :name="'preview-question' + index + '-option'"
            :id="'preview-question' + index + '-option' + optionIndex"
            disabled
            :checked="option.isCorrect"
          />
          <label :for="'preview-question' + index + '-option' + optionIndex">
            {{ option.text }}
          </label>
        </div>
      </div>
      <div v-else-if="question.question_type === 'fill-in-the-blanks'">
        <fill-in-the-blanks :question="question" />
      </div>
      <div v-else-if="question.question_type === 'hotspot'">
        <p>Hotspot questions are not supported in this preview.</p>
      </div>
      <div v-else-if="question.question_type === 'drag-and-drop'">
        <h3>Drag and Drop Preview:</h3>
        <div class="drag-and-drop-preview">
          <div
            v-for="(item, itemIndex) in question.items"
            :key="itemIndex"
            class="preview-item"
          >
            <div class="draggable">
              {{ item.draggable }}
            </div>
            <div class="dropzone">
              {{ item.dropzone }}
            </div>
          </div>
        </div>
      </div>

      <graded-quiz
        v-else-if="question.question_type === 'graded-quiz'"
        :question="question"
      ></graded-quiz>

      <personality-quiz
        v-else-if="question.question_type === 'personality-quiz'"
        :question="question"
      ></personality-quiz>
      <highlight-correct-sentence
        v-else-if="question.question_type === 'highlight-correct-sentences'"
        :question="question"
      ></highlight-correct-sentence>
      <order-items
        v-else-if="question.question_type === 'order-items'"
        :items="question"></order-items>

      <div v-else>This feature has no preview yet</div>
    </div>
  </div>
</template>

<script>
import GradedQuiz from "./Previews/GradedQuiz.vue";
import PersonalityQuiz from "./Previews/PersonalityQuiz.vue";
import FillInTheBlanks from "./Previews/FillInTheBlanks.vue";
import HighlightCorrectSentence from "./Previews/HighlightCorrectSentence.vue";
import OrderItems from "./Previews/OrderItems.vue";
export default {
  components: {
    GradedQuiz,
    PersonalityQuiz,
    FillInTheBlanks,
    OrderItems,
    HighlightCorrectSentence,
  },
  props: {
    question: Object,
    index: Number,
    styleClass: String,
  },
  data() {
    return {
      currentQuestionIndex: 0,
      score: 0,
      feedbackText: "",
      currentPersonalityQuestionIndex: 0,
      personalityCategories: {},
      personalityResultText: "",
    };
  },
  computed: {
    displayedFillInBlanks() {
      if (!this.question.question_text || !this.question.answer_options) {
        return "";
      }

      let result = this.question.question_text;
      this.question.answer_options.forEach((options, index) => {
        const correctIndex = options.correctIndex;
        const selectOptions = options.options
          .map(
            (option, i) =>
              `<option ${
                i === correctIndex ? "selected" : ""
              }>${option}</option>`
          )
          .join("");
        const selectElement = `<select>${selectOptions}</select>`;
        result = result.replace("___", selectElement);
      });
      return result;
    },
  },
};
</script>

<style scoped>
.graded-quiz li {
  list-style: none;
}
.graded-quiz button.option {
  color: black;
  background-color: transparent;
}

[disabled] {
  color: #27202f;
}

/* Custom radio button */
input[type="radio"] {
  display: none;
}

input[type="radio"] + label:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
  border: 1px solid #000;
  vertical-align: middle;
}

input[type="radio"]:checked + label:before {
  background: radial-gradient(
    #000 0%,
    #000 40%,
    transparent 50%,
    transparent 100%
  );
}

input[type="radio"]:disabled + label:before {
  opacity: 0.3;
}

.question-preview {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0px;
}

/* Formal style set */

.question-preview-formal select {
  background-color: #f5f5f5;
  border: 1px solid #524362;
}
.question-preview-formal {
  border: 1px solid #524362;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 0px;
}

.question-preview-formal .drag-and-drop-preview .draggable {
  background-color: #e3e3e3;
  border: 1px solid #b3b3b3;
}

.question-preview-formal .drag-and-drop-preview .dropzone {
  background-color: #d9d9d9;
  border: 2px dashed #b3b3b3;
}

/* Colorful style set */

.question-preview-colorful input[type="radio"]:checked + label:before {
  background: radial-gradient(
    #524362 0%,
    #524362 40%,
    transparent 50%,
    transparent 100%
  );
}

.question-preview-colorful select {
  background-color: #e8f0fe;
  border: 1px solid #66547b;
}

.question-preview-colorful {
  background-color: #e8f0fe;
  color: #66547b;
}

.question-preview-colorful .drag-and-drop-preview .draggable {
  background-color: #dbf3fa;
  border: 1px solid #a8d2e6;
}

.question-preview-colorful .drag-and-drop-preview .dropzone {
  background-color: #c9e8f8;
  border: 2px dashed #a8d2e6;
}

/* Monochrome style set */

.question-preview-monochrome select {
  background-color: #ffffff;
  border: 1px solid #27202f;
}

.question-preview-monochrome {
  background-color: #ffffff;
  color: #27202f;
}

.question-preview-monochrome .drag-and-drop-preview .draggable {
  background-color: #f1f1f1;
  border: 1px solid #d7d7d7;
}

.question-preview-monochrome .drag-and-drop-preview .dropzone {
  background-color: #e1e1e1;
  border: 2px dashed #d7d7d7;
}

.drag-and-drop-preview {
  display: flex;
  flex-direction: column;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.question-preview-formal .graded-quiz button.option {
  box-shadow: none;
  border: 4px double #000;
  border-radius: 0;
}

.question-preview-formal .graded-quiz button.option:hover {
  text-shadow: none;
  text-decoration: underline;
}

.draggable,
.dropzone {
  min-width: 2rem;
  min-height: 2rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Formal style set */
.question-preview-formal input[type="radio"],
.question-preview-formal input[type="checkbox"] {
  margin-right: 0.5rem;
}

.question-preview-formal select {
  border: 1px solid #b3b3b3;
  background-color: #e3e3e3;
  color: #333;
}

/* Colorful style set */
.question-preview-colorful input[type="radio"],
.question-preview-colorful input[type="checkbox"] {
  margin-right: 0.5rem;
  background-color: #dbf3fa;
  border: 1px solid #a8d2e6;
}

.question-preview-colorful select {
  border: 1px solid #a8d2e6;
  background-color: #dbf3fa;
  color: #66547b;
}

/* Monochrome style set */
.question-preview-monochrome input[type="radio"],
.question-preview-monochrome input[type="checkbox"] {
  margin-right: 0.5rem;
}

.question-preview-monochrome select {
  border: 1px solid #d7d7d7;
  background-color: #f1f1f1;
  color: #27202f;
}

.question-preview-monochrome .graded-quiz button.option {
  box-shadow: 2px 2px 0 #000;
  border: none;
  border-radius: 0;
}

.question-preview-monochrome .graded-quiz button.option:hover {
  box-shadow: 0px 0px 0 2px #000;
  text-shadow: none;
  text-decoration: none;
}

/* Dark mode */
.question-preview-dark {
  background-color: #222;
  color: #fff;
}
/* Headers */
.question-preview-dark h1,
.question-preview-dark h2,
.question-preview-dark h3,
.question-preview-dark h4,
.question-preview-dark h5,
.question-preview-dark h6 {
  color: #fff;
}

/* Buttons */
.question-preview-dark button,
.question-preview-dark .button {
  background-color: #222;
  color: #fff;
  border: 2px solid #fff;
}

.question-preview-dark .graded-quiz button.option {
  color: white;
  background-color: transparent;
}

/* Paragraphs */
.question-preview-dark p {
  color: #fff;
}

.question-preview-dark .drag-and-drop-preview .draggable {
  background-color: hsl(0, 0%, 0%);
  border: 1px solid #d7d7d7;
  box-shadow: 2px 2px 4px 1px rgba(255, 255, 255, 0.3);
}

.question-preview-dark .drag-and-drop-preview .dropzone {
  background-color: #000000;
  border: 4px dashed #d7d7d7;
}

/* Labels */
.question-preview-dark label {
  color: #fff;
}

/* Input fields */
.question-preview-dark input,
.question-preview-dark select {
  background-color: #333;
  color: #fff;
  border: 1px solid #fff;
}

.question-preview-dark input[type="radio"] + label:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  vertical-align: middle;
}

.question-preview-dark input[type="radio"]:checked + label:before {
  background: radial-gradient(
    #ffffff 0%,
    #ffffff 40%,
    transparent 50%,
    transparent 100%
  );
}

/* Base styles */
.question-preview-modern {
  background-color: #f5f5f5;
  color: #222;
  border-radius: 10px;
}

/* Headers */
.question-preview-modern h1,
.question-preview-modern h2,
.question-preview-modern h3,
.question-preview-modern h4,
.question-preview-modern h5,
.question-preview-modern h6 {
  color: #333;
}

/* Buttons */
.question-preview-modern button,
.question-preview-modern .button {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.question-preview-modern .graded-quiz button.option {
  color: #333;
  background-color: #f5f5f5;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.question-preview-modern .button:hover,
.question-preview-modern .graded-quiz button.option:hover {
  background-color: #222;
  color: #d7d7d7;
}

/* Paragraphs */
.question-preview-modern p {
  color: #333;
  line-height: 1.5;
}

.question-preview-modern .drag-and-drop-preview .draggable {
  background-color: hsl(55, 89%, 93%);
  border: 1px solid #d7d7d7;
  box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.3);
}

.question-preview-modern .drag-and-drop-preview .dropzone {
  background-color: #e1e1e1;
  border: 2px dashed #d7d7d7;
}

/* Labels */
.question-preview-modern label {
  color: #333;
  font-size: 1rem;
}

/* Input fields */
.question-preview-modern input,
.question-preview-modern select {
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
  transition: box-shadow 0.3s ease;
}

.question-preview-modern input[type="radio"] + label:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
  border: 1px solid #333;
  vertical-align: middle;
}

.question-preview-modern input[type="radio"]:checked + label:before {
  background: radial-gradient(
    #333 0%,
    #333 40%,
    transparent 50%,
    transparent 100%
  );
}

.question-preview-modern input:focus,
.question-preview-modern select:focus {
  box-shadow: 0 0 5px #333;
}
</style>
