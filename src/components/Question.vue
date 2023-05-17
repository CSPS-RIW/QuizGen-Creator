<template>
  <div class="question">
    <div class="ActivityHeader">
      <h2>Question {{ index + 1 }}</h2>
      <div>
        <label for="question-type">Question Type:</label><select v-model="dataQuestion.question_type"
          @change="onQuestionTypeChange">
          <option value="single-select">Single Select</option>
          <option value="multiple-select">Multiple Select</option>
          <option value="true-false">True or False</option>
          <option value="fill-in-the-blanks">Fill in the Blank</option>
          <option value="drag-and-drop">Drag And Drop</option>
          <option value="graded-quiz">Graded Quiz</option>
          <option value="personality-quiz">Personality Quiz</option>
          <option value="highlight-correct-sentences">
            Highlight Sentences
          </option>
          <option value="simple-reveal">Simple Reveal</option>
        </select>
      </div>
    </div>

    <!-- Single Select -->
    <div v-if="dataQuestion.question_type === 'single-select'">
      <div>
        <label for="question-text">Question Text: </label><input type="text" v-model="dataQuestion.question_text" />
      </div>
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <div v-for="(option, qindex) in dataQuestion.answer_options" :key="qindex">
        <button title="Delete option" class="delete-option" @click.prevent="deleteOption(qindex)"><svg width="20" height="20"><use href="#deleteButton"></use></svg></button>
        <label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
        <input type="text" v-model="option.text" />
        <input type="radio" :name="'question' + index + '-option'" :id="'isCorrect' + index + '-option' + qindex"
          :checked="option.isCorrect" @change="updateSingleSelectCorrectAnswer(qindex)" />
        &nbsp;<label :for="'isCorrect' + index + '-option' + qindex"> </label>
        <br />
      </div>
      <button class="add-option" @click.prevent="addOption">Add Option</button>
    </div>

    <!-- Multiple Select -->
    <div v-else-if="dataQuestion.question_type === 'multiple-select'">
      <label for="question-text">Question Text:</label><input type="text" v-model="dataQuestion.question_text" />
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <div v-for="(option, qindex) in dataQuestion.answer_options" :key="qindex">
        <button title="Delete option" class="delete-option" @click.prevent="deleteOption(qindex)"><svg width="20" height="20"><use href="#deleteButton"></use></svg></button>
        <label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
        <input type="text" v-model="option.text" />
        &nbsp;<input type="checkbox" :name="'question' + index + '-option'" v-model="option.isCorrect" />
        <br />
      </div>
      <button class="add-option" @click.prevent="addOption">Add Option</button>
    </div>

    <div v-else-if="dataQuestion.question_type === 'true-false'">
      <label for="question-text">Question Text:</label><input type="text" v-model="dataQuestion.question_text" />
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <div v-for="(option, qindex) in dataQuestion.answer_options" :key="qindex">
        <label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
        <input type="text" v-model="dataQuestion.answer_options[qindex].text" />
        &nbsp;<input type="radio" :id="'question' + index + '-option' + qindex" :name="'question' + index + '-option'"
          @change="updateSingleSelectCorrectAnswer(qindex)" :value="option.value" :checked="option.isCorrect" />
        <label :for="'question' + index + '-option' + qindex">Correct</label>
        <br />
      </div>
    </div>
    <div v-else-if="dataQuestion.question_type === 'fill-in-the-blanks'">
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <FillBlanks @update:question="handleFillBlanksUpdate" :loadedJson="dataQuestion" :questionIndex="index" />
    </div>
    <div v-else-if="dataQuestion.question_type === 'hotspot'">
      <HotSpotGenerator @update:shapes="handleHotSpotUpdate" />
    </div>
    <div v-else-if="dataQuestion.question_type === 'drag-and-drop'">
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <drag-and-drop @update:activity="handleDragAndDropUpdate" :loadedJson="dataQuestion" />
    </div>
    <div v-else-if="dataQuestion.question_type === 'graded-quiz'">
      <GradedQuiz @update:activity="handleGradedQuizUpdate" :loadedJson="dataQuestion.gradedQuiz" />
    </div>
    <div v-else-if="dataQuestion.question_type === 'personality-quiz'">
      <PersonalityQuiz @save-quiz="handlePersonalityQuizSubmit" :loadedJson="dataQuestion.personalityQuiz" />
    </div>
    <div v-else-if="dataQuestion.question_type === 'highlight-correct-sentences'">
      <div>
        <label for="question-instructions">Answer Instructions: </label><input type="text"
          v-model="dataQuestion.instructions" />
      </div>
      <GenerateSentences @update:activity="handleHighlightCorrectSentencesUpdate" :loadedJson="dataQuestion">
      </GenerateSentences>
    </div>
    <!-- Simple Reveal -->
    <div v-else-if="dataQuestion.question_type === 'simple-reveal'">
      <div>
        <label for="question-text">Page Header: </label>
        <input type="text" v-model="dataQuestion.question_text" />
      </div>
      <div>
        <label for="question-instructions">Instructions: </label>
        <input type="text" v-model="dataQuestion.instructions" />
      </div>
      <div>
        <label for="hidden-content">Content of the first page: </label>
        <textarea v-model="dataQuestion.first_content"></textarea>
      </div>

      <div>
        <label for="hidden-content">Hidden Content: </label>
        <textarea v-model="dataQuestion.hidden_content"></textarea>
      </div>
    </div>
    <br />
    <div v-if="dataQuestion.question_type === 'multiple-select' ||
      dataQuestion.question_type === 'true-false' ||
      dataQuestion.question_type === 'single-select' ||
      dataQuestion.question_type === 'fill-in-the-blanks' ||
      dataQuestion.question_type === 'highlight-correct-sentences'
      ">
      <label for="generic-feedback">Generic Feedback:</label>
      <textarea v-model="dataQuestion.generic_feedback"></textarea>
      <br />
      <label for="correct-feedback">Correct Feedback:</label>
      <textarea v-model="dataQuestion.correct_feedback"></textarea>
      <br />
      <label for="incorrect-feedback">Incorrect Feedback:</label>
      <textarea v-model="dataQuestion.incorrect_feedback"></textarea>
      <br />
    </div>
    <hr />
    <button @click="deleteQuestion(index)">Delete Question</button>
    <svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 18 18"
            style="display: none;"
					>
          <symbol id="deleteButton" viewBox="0 0 18 18">
						<g transform="translate(-3.375 -3.375)">
							<path
								id="Path_1"
								data-name="Path 1"
								d="M18.246,16.875H11.14c-.345,0-.628.285-.628.76a.678.678,0,0,0,.628.76h7.106a.773.773,0,0,0,0-1.519Z"
								transform="translate(-2.318 -5.26)"
								fill="#E51212"
							/>
							<path
								id="Path_2"
								data-name="Path 2"
								d="M12.375,4.587a7.785,7.785,0,1,1-5.508,2.28,7.737,7.737,0,0,1,5.508-2.28m0-1.212a9,9,0,1,0,9,9,9,9,0,0,0-9-9Z"
								fill="#E51212"
							/>
						</g>
            </symbol>
					</svg>
  </div>
</template>

<script>
import FillBlanks from "./FillBlanks.vue";
import HotSpotGenerator from "./HotspotGenerator.vue";
import GradedQuiz from "./GradedQuiz.vue";
import DragAndDrop from "./DragAndDrop.vue";
import PersonalityQuiz from "./PersonalityQuiz.vue";
import GenerateSentences from "./GenerateSentences.vue";
export default {
  props: ["index", "question"],
  emits: ["update:question", "delete-question", "update:readyForChange"],
  components: {
    FillBlanks,
    HotSpotGenerator,
    DragAndDrop,
    GradedQuiz,
    PersonalityQuiz,
    GenerateSentences,
  },
  data() {
    return {
      dataQuestion: this.question, // Use the question prop for initializing dataQuestion
      readyForChange: false,
    };
  },

  methods: {
    handleHighlightCorrectSentencesUpdate(SentencesData) {
      this.dataQuestion.question_text = SentencesData.text;
      this.dataQuestion.correct_answer = SentencesData.correct_answer;
      this.readyForChange = true;
    },

    handleGradedQuizUpdate(QuestionSet) {
      this.dataQuestion.question_text = "Graded Quiz Activity";
      this.dataQuestion.gradedQuiz = QuestionSet;
      this.readyForChange = true;
    },
    handleHotSpotUpdate(shapes) {
      this.dataQuestion.shapes = shapes;
    },
    handleFillBlanksUpdate(fillBlanksData) {
      this.dataQuestion.question_text = fillBlanksData.question_text;
      this.dataQuestion.answer_options = fillBlanksData.answer_options.map(
        (optionsData, index) => {
          const correctOption = optionsData.options.find(
            (option, optionIndex) => optionIndex === optionsData.correctIndex
          );
          return {
            text: `Blank ${index + 1}`,
            options: optionsData.options,
            correctIndex: optionsData.correctIndex,
          };
        }
      );
    },
    handleDragAndDropUpdate(dragAndDropData) {
      this.dataQuestion.question_text = "Drag and Drop Activity";
      this.dataQuestion.items = dragAndDropData.items.map((item, index) => {
        return {
          draggable: item.draggable,
          dropzone: item.dropzone,
        };
      });
    },

    handlePersonalityQuizSubmit(quizData) {
      this.readyForChange = false;
      this.dataQuestion.question_text = quizData.question_text;
      this.dataQuestion.personalityQuiz = {
        categories: quizData.categories,
        questions: quizData.questions,
      };
      this.readyForChange = true;
    },

    addOption() {
      this.dataQuestion.answer_options.push({ text: "", isCorrect: false });
    },
    onQuestionTypeChange() {
      this.readyForChange = false;
      this.dataQuestion.question_text = "";
      this.dataQuestion.instructions = "";
      this.dataQuestion.answer_options = [];
      this.dataQuestion.items = [];
      this.dataQuestion.gradedQuiz = {};
      this.dataQuestion.shapes = [];

      switch (this.dataQuestion.question_type) {
        case "highlight-correct-sentences":
          this.handleHighlightCorrectSentencesUpdate({
            text: "",
            correct_answer: [],
          });
          break;
        case "hotspot":
          this.handleHotSpotUpdate([]);
          break;
        case "single-select":
        case "multiple-select":
          break;
        case "true-false":
          this.dataQuestion.answer_options = [
            { text: "True", value: "isTrue" },
            { text: "False", value: "isFalse" },
          ];
          this.dataQuestion.correct_answer = null;
          break;
        case "drag-and-drop":
          this.handleDragAndDropUpdate({ items: [] });
          break;
        case "fill-in-the-blanks":
          this.handleFillBlanksUpdate({ answer_options: [] });
          break;
        case "graded-quiz":
          this.handleGradedQuizUpdate({
            questions: [
              {
                question: "",
                options: [
                  {
                    text: "",
                    score: 0,
                  },
                ],
              },
            ],
            feedbacks: [
              {
                minScore: 0,
                maxScore: 0,
                text: "",
              },
            ],
          });
          break;
        case "personality-quiz":
          this.handlePersonalityQuizSubmit({
            categories: [
              {
                name: "",
                feedback: "",
              },
            ],
            questions: [
              {
                text: "",
                options: [
                  {
                    text: "",
                  },
                ],
              },
            ],
          });
          break;
        default:
          this.dataQuestion.answer_options = [];
          break;
      }
    },

    updateSingleSelectCorrectAnswer(qindex) {
      this.dataQuestion.answer_options.forEach((option, index) => {
        option.isCorrect = index === qindex;
      });
    },
    deleteQuestion(index) {
      if (confirm("Are you sure you want to delete this question?")) {
        this.$emit("delete-question", this.index);
      }
    },
  },
  watch: {
    question(newQuestion) {
      this.dataQuestion = newQuestion; // Update dataQuestion with the new question prop value
    },
    dataQuestion: {
      deep: true,
      handler() {
        this.$emit("update:question", this.dataQuestion);
      },
    },
    readyForChange: {
      handler(newValue) {
        this.$emit("update:readyForChange", newValue);
      },
    },
  },
};
</script>

<style scoped>
.ActivityHeader {
  display: flex;
  justify-content: space-between;
}
.delete-option {
  position: relative;
  top: .25rem;
  background-color:transparent;
  box-shadow: none;
  border: none;
  border-radius: 0;
  margin: 4px 0px;
  cursor: pointer;
}
</style>
