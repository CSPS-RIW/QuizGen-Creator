<template>
	<div class="container">
		<div class="left-column">
			<h1>
				<button class="question-mark-icon" @click="openModal" tabindex="0">
					&#x3F;
				</button>
				Create Quiz Questions
			</h1>
			<details>
				<summary>Welcome to the Quiz Question Creator!</summary>
				<p>
					This user-friendly tool helps you generate engaging quizzes for your
					e-learning courses. The available question types include
					single-select, multiple-select, true/false, fill-in-the-blank,
					hotspot, drag-and-drop, graded quiz, and personality quiz. This
					variety enables you to create quizzes that cater to your specific
					learning objectives and target audience.
				</p>

				<p>To get started, simply follow these steps:</p>
				<ol>
					<li>
						Click the "?" button to open the instructions and familiarize
						yourself with the different question types and their uses.
					</li>
					<li>Enter a name for your quiz in the text field.</li>
					<li>
						Click the "Add Question" button to add a new question to your quiz.
						You can customize each question's type, text, answer options, and
						feedback as needed.
					</li>
					<li>
						The right column displays a live preview of your questions. Review
						them to ensure they look as intended.
					</li>
					<li>
						Once you've added all your questions, you'll see the "Generated Save
						File" in the JSON format in the right column. You can download this
						file by clicking the "Download Quiz Data" button.
					</li>
					<li>
						To load a quiz from an existing JSON file, click the "Load Quiz
						Data" button and select the file from your device.
					</li>
				</ol>
				<p>
					With this tool, creating professional quizzes for your e-learning
					courses has never been easier. Happy quiz-making!
				</p>
			</details>

			<div>
				<div
					id="instructionsModal"
					class="modal"
					@click="closeModalOnClickOutside"
					ref="modalBackdrop"
				>
					<div
						class="modal-content"
						@keydown.esc="closeModal"
						tabindex="-1"
						ref="modalContent"
					>
						<button class="close" @click="closeModal" tabindex="0">
							&times;
						</button>
						<ol>
							<li>
								<strong>Single-select questions:</strong> Create questions with
								multiple answer options, but only one correct answer. Use these
								questions to assess the learners' understanding of key concepts
								or facts.
							</li>

							<li>
								<strong>Multiple-select questions:</strong> Craft questions with
								several answer options, where more than one option may be
								correct. This question type is useful for testing the learners'
								comprehension of complex topics or scenarios.
							</li>

							<li>
								<strong>True/false questions:</strong> Design simple questions
								where learners must determine if a statement is true or false.
								This question type is ideal for assessing the learners'
								knowledge of basic facts and principles.
							</li>

							<li>
								<strong>Fill-in-the-blank questions:</strong> Create questions
								with missing words or phrases that learners must complete. These
								questions are effective for testing the learners' recall of
								specific terminology, definitions, or concepts.
							</li>

							<li>
								<strong>Hotspot questions:</strong> Develop questions that
								require learners to identify specific areas on an image or
								diagram. This question type is great for evaluating the
								learners' ability to recognize visual elements or locate key
								components within an illustration.
							</li>

							<li>
								<strong>Drag-and-drop questions:</strong> Design questions where
								learners must drag items to their correct locations or match
								them with corresponding elements. This question type is perfect
								for assessing the learners' understanding of relationships,
								sequences, or classifications.
							</li>

							<li>
								<strong>Graded quiz:</strong> Create a series of questions with
								individual scores, which are combined to form an overall grade.
								Use this question type to evaluate the learners' performance
								throughout the course and provide tailored feedback based on
								their scores.
							</li>

							<li>
								<strong>Personality quiz:</strong> Develop quizzes that assign
								learners to different categories or profiles based on their
								responses. This question type can be used for self-assessment or
								to help learners better understand their strengths and areas for
								improvement.
							</li>
						</ol>
					</div>
				</div>
			</div>

			<input type="text" v-model="myQuiz" />
			<hr />
			<div>
				<Question
					v-for="(question, index) in questions"
					:key="index"
					:index="index"
					:question="questions[index]"
					@update:question="updateQuestion(index, $event)"
					@delete-question="removeQuestion"
					@update:readyForChange="setReadyforChange(index, $event)"
				/>
			</div>
			<button @click="addQuestion">Add Question</button>
		</div>
		<div class="right-column">
			<div>
				<input
					type="file"
					ref="fileInput"
					@change="loadQuizData"
					accept=".txt,.json"
					style="display: none"
				/>
				<button @click="$refs.fileInput.click()">Load Quiz Data</button>
			</div>
			<div class="style-selector">
				<label for="style-set">Select a style set:</label>
				<select id="style-set" v-model="selectedStyle">
					<option value="formal">Formal</option>
					<option value="colorful">Colorful</option>
					<option value="monochrome">Monochrome</option>
					<option value="modern">Modern</option>
					<option value="dark">Dark</option>
				</select>
			</div>
			<div v-for="(question, index) in questions" :key="'preview-' + index">
				<QuestionPreview
					:question="question"
					:index="index"
					:readyforchange="readyForChange"
					:styleClass="styleClass"
				/>
			</div>

			<div class="generated-json-box">
				<h2>Generated Save File:</h2>
				<textarea readonly>{{ quizJSON }}</textarea>
				<button v-if="quizJSON" @click="downloadQuizData">
					Download Quiz Data
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import Question from "./Question.vue";
import QuestionPreview from "./QuestionPreview.vue";
export default {
	components: {
		Question,
		QuestionPreview,
	},
	data() {
		return {
			myQuiz: "Quiz Name",
			questions: [],
			readyForChange: false,
			selectedStyle: "formal",
		};
	},
	computed: {
		styleClass() {
			return `question-preview-${this.selectedStyle}`;
		},
		quizJSON() {
			const quizData = {
				quiz_title: this.myQuiz,
				questions: this.questions.map((question) => {
					const {
						question_type,
						question_text,
						answer_options,
						items,
						generic_feedback,
						correct_feedback,
						incorrect_feedback,
					} = question;

					// Function to generate question object
					const generateQuestionObject = (baseQuestion) => {
						const shouldIncludeFeedback = [
							"single-select",
							"multiple-select",
							"true-false",
							"fill-in-the-blanks",
							"drag-and-drop",
						].includes(question_type);

						if (shouldIncludeFeedback) {
							return {
								...baseQuestion,
								generic_feedback,
								correct_feedback,
								incorrect_feedback,
							};
						}
						return baseQuestion;
					};

					const processedAnswerOptions =
						question_type === "single-select" ||
						question_type === "multiple-select" ||
						question_type === "true-false"
							? answer_options.map((option, index) => ({
									text: option.text,
									isCorrect: option.isCorrect,
							  }))
							: question_type === "fill-in-the-blanks"
							? answer_options
							: question_type === "drag-and-drop"
							? items
							: undefined;

					const processedCorrectAnswer =
						question_type === "single-select"
							? question.correct_answer
							: question_type === "multiple-select"
							? processedAnswerOptions
									.map((option, index) => (option.isCorrect ? index : -1))
									.filter((index) => index !== -1)
							: question_type === "true-false"
							? answer_options.findIndex(
									(option) => option.value === question.correct_answer
							  )
							: question_type === "fill-in-the-blanks"
							? answer_options.map((option) => option.correctIndex)
							: undefined;
					const gradedQuiz =
						question.question_type === "graded-quiz"
							? question.gradedQuiz
							: undefined;
					const personalityQuiz =
						question.question_type === "personality-quiz"
							? question.personalityQuiz
							: undefined;
					const shapes =
						question.question_type === "hotspot" 
							? question.shapes
							: undefined;

					return generateQuestionObject({
						question_type,
						question_text,
						answer_options: processedAnswerOptions,
						correct_answer: processedCorrectAnswer,
						gradedQuiz,
						personalityQuiz,
						shapes,
					});
				}),
			};

			return JSON.stringify(quizData, null, 2);
		},
	},

	methods: {
		openModal() {
			document.getElementById("instructionsModal").style.display = "block";
			this.$refs.modalContent.focus();
		},
		closeModalOnClickOutside(event) {
			if (event.target === this.$refs.modalBackdrop) {
				this.closeModal();
			}
		},
		closeModal() {
			document.getElementById("instructionsModal").style.display = "none";
		},
		setReadyforChange(index, event) {
			this.readyForChange = event;
		},
		addQuestion() {
			this.questions.push(this.newQuestion());
		},
		loadQuizData(event) {
			const file = event.target.files[0];
			if (!file) {
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const jsonDataString = JSON.parse(e.target.result); // First parse to get the JSON string
					const jsonData = JSON.parse(jsonDataString); // Second parse to get the actual JSON object

					if (jsonData && jsonData.questions) {
						this.questions = [];
						this.questions = jsonData.questions;
						this.myQuiz = jsonData.quiz_title;
					} else {
						alert("Invalid JSON data");
					}
				} catch (error) {
					alert("Error parsing JSON file");
				}
			};
			reader.readAsText(file);
		},

		updateQuestion(index, updatedQuestion) {
			this.questions.splice(index, 1, updatedQuestion);
		},
		newQuestion() {
			return {
				question_type: "single-select",
				question_text: "",
				answer_options: [
					{
						text: "",
						value: "true",
						isCorrect: false,
					},
					{
						text: "",
						value: "false",
						isCorrect: false,
					},
				],
				generic_feedback: "",
				correct_feedback: "",
				incorrect_feedback: "",
			};
		},
		downloadQuizData() {
			const data = JSON.stringify(this.quizJSON, null, 2);
			const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "QuizData.txt";
			link.click();
			URL.revokeObjectURL(url);
		},
		removeQuestion(index) {
			this.questions.splice(index, 1);
		},
	},
};
</script>

<style>
body {
	font-family: Arial, sans-serif;
	background-color: #f5f5f5;
	line-height: 1.6;
}

input {
	box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	border: 1px solid #999;
}

details {
	background-color: #f9f9f9;
	border: 1px solid #ccc;
	border-radius: 5px;
	padding: 10px;
	width: 80%;
	margin: 20px auto;
}

summary {
	font-weight: bold;
	cursor: pointer;
	color: #333;
	font-size: 1.2em;
}

.container {
	display: flex;
	flex-wrap: wrap;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.left-column {
	flex: 1;
	padding: 20px;
	background-color: #ffffff;
	border-radius: 5px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.right-column {
	flex-basis: 300px;
	padding: 20px;
	margin-left: 20px;
	background-color: #ffffff;
	border-radius: 5px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

h1 {
	margin-top: 0;
	margin-bottom: 20px;
}

button {
	border: 2px solid #ccc;
	background-color: #4e5b73;
	color: #fff;
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	margin-bottom: 20px;
	margin-top: 0.25em;
	box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.3);
}

button:hover {
	color: white;
	background-color: #3f2a56;
	text-shadow: 1px 3px 4px rgba(0, 0, 0, 0.9);
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
}

button:not(:last-child) {
	margin-right: 10px;
}

button.add-option {
	background-color: #ffffff;
	box-shadow: none;
	padding: 0;
}

button.add-option:hover {
	color: #000;
}
button.add-option:before {
	background-color: #2cc71b;
	width: 20px;
	height: 20px;
	font-size: 18px;
	font-weight: 600;
	color: #fff;
	border-radius: 50%;
	content: "\00ff0b";
	padding: 0 1px;
	line-height: 1rem;
	margin-right: 0.5rem;
	text-align: center;
}

button.remove-button {
	color: #d32f2f;
	background-color: white;
	font-weight: bold;
	padding: 0px 0px;
	vertical-align: sub;
	font-size: 18px;
	margin-right: 5px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.25rem;
	height: 1.25rem;
	box-shadow: none;
}

button.remove-button:hover {
	color: #000000;
	box-shadow: none;
	transform: rotate(359deg);
	transition: all 0.5s ease-in-out;
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

textarea {
	width: 100%;
	height: 2.5rem;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
	resize: none;
}

textarea[readonly] {
	margin-top: 2rem;
	border-top: 1px solid #ccc;
	padding-top: 1rem;
	resize: vertical;
	min-width: 10rem;
	min-height: 15rem;
}

.modal {
	display: none;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
	background-color: #fff;
	margin: 15% auto;
	padding: 20px;
	border: 1px solid #888;
	width: 80%;
}

.close {
	color: #aaa;
	float: right;
	font-size: 28px;
	font-weight: bold;
	cursor: pointer;
}

.close:hover {
	color: #000;
}

.question-mark-icon {
	background-color: rgba(63, 42, 86, 0.5);
	color: #fff;
	border-radius: 50%;
	width: 1em;
	height: 1em;
	font-size: 36px;
	cursor: pointer;
	text-align: center;
	line-height: 0.75em;
	padding: 0;
}
</style>
