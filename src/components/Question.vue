<template>
	<div class="question">
		<div class="ActivityHeader">
			<h2>Question {{ index + 1 }}</h2>
			<div>
				<label for="question-type">Question Type:</label
				><select
					v-model="dataQuestion.question_type"
					@change="onQuestionTypeChange"
				>
					<option value="single-select">Single Select</option>
					<option value="multiple-select">Multiple Select</option>
					<option value="true-false">True or False</option>
					<option value="fill-in-the-blanks">Fill in the Blank</option>
					<option value="hotspot">Hotspot Question</option>
					<option value="drag-and-drop">Drag And Drop</option>
					<option value="graded-quiz">Graded Quiz</option>
					<option value="personality-quiz">Personality Quiz</option>
				</select>
			</div>
		</div>

		<!-- Single Select -->
		<div v-if="dataQuestion.question_type === 'single-select'">
			<div>
			<label for="question-text">Question Text: </label
			><input type="text" v-model="dataQuestion.question_text" />
		</div>
		<div>
			<label for="question-instructions">Answer Instructions: </label
			><input type="text" v-model="dataQuestion.instructions" />
		</div>
			<div
				v-for="(option, qindex) in dataQuestion.answer_options"
				:key="qindex"
			>
				<label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
				<input type="text" v-model="option.text" />
				<input
					type="radio"
					:name="'question' + index + '-option'"
					:id="'isCorrect' + index + '-option' + qindex"
					:checked="option.isCorrect"
					@change="updateSingleSelectCorrectAnswer(qindex)"
				/>
				&nbsp;<label :for="'isCorrect' + index + '-option' + qindex"> </label>
				<br />
			</div>
			<button class="add-option" @click.prevent="addOption">Add Option</button>
		</div>

		<!-- Multiple Select -->
		<div v-else-if="dataQuestion.question_type === 'multiple-select'">
			<label for="question-text">Question Text:</label
			><input type="text" v-model="dataQuestion.question_text" />
			<div>
			<label for="question-instructions">Answer Instructions: </label
			><input type="text" v-model="dataQuestion.instructions" />
		</div>
			<div
				v-for="(option, qindex) in dataQuestion.answer_options"
				:key="qindex"
			>
				<label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
				<input type="text" v-model="option.text" />
				&nbsp;<input
					type="checkbox"
					:name="'question' + index + '-option'"
					v-model="option.isCorrect"
				/>
				<br />
			</div>
			<button class="add-option" @click.prevent="addOption">Add Option</button>
		</div>

		<div v-else-if="dataQuestion.question_type === 'true-false'">
			<label for="question-text">Question Text:</label
			><input type="text" v-model="dataQuestion.question_text" />
			<div>
			<label for="question-instructions">Answer Instructions: </label
			><input type="text" v-model="dataQuestion.instructions" />
		</div>
			<div
				v-for="(option, qindex) in dataQuestion.answer_options"
				:key="qindex"
			>
				<label :for="'option' + (qindex + 1)">Option {{ qindex + 1 }}:</label>
				<input type="text" v-model="dataQuestion.answer_options[qindex].text" />
				&nbsp;<input
					type="radio"
					:id="'question' + index + '-option' + qindex"
					:name="'question' + index + '-option'"
					@change="updateSingleSelectCorrectAnswer(qindex)"
					:value="option.value"
					:checked="option.isCorrect"
				/>
				<label :for="'question' + index + '-option' + qindex">Correct</label>
				<br />
			</div>
		</div>
		<div v-else-if="dataQuestion.question_type === 'fill-in-the-blanks'">
			<div>
			<label for="question-instructions">Answer Instructions: </label
			><input type="text" v-model="dataQuestion.instructions" />
		</div>
			<FillBlanks
				@update:question="handleFillBlanksUpdate"
				:loadedJson="dataQuestion"
				:questionIndex="index"
			/>
		</div>
		<div v-else-if="dataQuestion.question_type === 'hotspot'">
			<HotSpotGenerator @update:shapes="handleHotSpotUpdate" />
		</div>
		<div v-else-if="dataQuestion.question_type === 'drag-and-drop'">
			<div>
			<label for="question-instructions">Answer Instructions: </label
			><input type="text" v-model="dataQuestion.instructions" />
		</div>
			<drag-and-drop @update:activity="handleDragAndDropUpdate" 
			:loadedJson="dataQuestion"/>
		</div>
		<div v-else-if="dataQuestion.question_type === 'graded-quiz'">
			<GradedQuiz
				@update:activity="handleGradedQuizUpdate"
				:loadedJson="dataQuestion.gradedQuiz"
			/>
		</div>
		<div v-else-if="dataQuestion.question_type === 'personality-quiz'">
			<PersonalityQuiz
				@save-quiz="handlePersonalityQuizSubmit"
				:loadedJson="dataQuestion.personalityQuiz"
			/>
		</div>
		<br />
		<div
			v-if="
				dataQuestion.question_type === 'multiple-select' ||
				dataQuestion.question_type === 'true-false' ||
				dataQuestion.question_type === 'single-select' ||
				dataQuestion.question_type === 'fill-in-the-blanks'
			"
		>
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
	</div>
</template>

<script>
import FillBlanks from "./FillBlanks.vue";
import HotSpotGenerator from "./HotspotGenerator.vue";
import GradedQuiz from "./GradedQuiz.vue";
import DragAndDrop from "./DragAndDrop.vue";
import PersonalityQuiz from "./PersonalityQuiz.vue";
export default {
	props: ["index", "question"],
	emits: ["update:question", "delete-question", "update:readyForChange"],
	components: {
		FillBlanks,
		HotSpotGenerator,
		DragAndDrop,
		GradedQuiz,
		PersonalityQuiz,
	},
	data() {
		return {
			dataQuestion: this.question, // Use the question prop for initializing dataQuestion
			readyForChange: false,
		};
	},

	methods: {
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
			this.dataQuestion.shapes=[];

			switch (this.dataQuestion.question_type) {
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

<style>
.ActivityHeader {
	display: flex;
	justify-content: space-between;
}
</style>
