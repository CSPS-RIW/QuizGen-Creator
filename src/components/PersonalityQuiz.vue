<template>
	<div class="personalityTest">
		<h2>
			<button class="question-mark-icon" @click="openModal" tabindex="0">
				&#x3F;
			</button>
			Personality Quiz
		</h2>
		<div>
			<div
				id="PersonalityinstructionsModal"
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
					<h2>How to Create Your Personality Quiz</h2>
					<p>
						1. Begin by typing the instructions for your quiz in the box labeled
						"Enter Test instructions." These instructions will guide users on
						what to expect and any steps they need to follow before starting the
						quiz.
					</p>
					<p>
						2. Set the number of categories for your quiz by entering a value in
						the "Number of Categories" input field. Categories represent the
						different results users can get based on their answers.
					</p>
					<p>
						3. For each category, provide a unique name in the "Category name"
						input field. This name will help identify the category and will be
						shown in the results.
					</p>
					<p>
						4. Click on the "Add Question" button to create a new question. Type
						the question text in the "Question text" input field.
					</p>
					<p>
						5. For each question, add an option corresponding to each category.
						Type the option text in the "Option text" input field. The option
						should be relevant to the category it represents.
					</p>
					<p>
						6. To remove a question, click the "Remove Question" button next to
						it.
					</p>
					<p>
						7. For each category, write a feedback message in the "Feedback for
						[Category name]" textarea. This message will be shown to users when
						they get the corresponding category as their result.
					</p>
					<p>
						8. Once you've completed your quiz, click on the "Save Quiz" button
						to store your personality quiz.
					</p>
				</div>
			</div>
		</div>

		<input
			type="text"
			v-model="question_text"
			placeholder="Enter Test instructions"
		/>
		<div>
			<label for="categories">Number of Categories:</label>
			<input
				type="number"
				id="categories"
				v-model.number="numCategories"
				min="1"
			/>
		</div>

		<div
			v-for="(category, index) in categories"
			:key="'category-' + index"
			class="category"
		>
			<label :for="'category-' + index">Category {{ index + 1 }}:</label>
			<input
				type="text"
				:id="'category-' + index"
				v-model="category.name"
				placeholder="Category name"
			/>
		</div>
		<h3>Questions</h3>
		<div
			v-for="(question, index) in questions"
			:key="'question-' + index"
			class="question"
		>
			<label :for="'question-' + index">Question {{ index + 1 }}:</label>
			<input
				type="text"
				:id="'question-' + index"
				v-model="question.text"
				placeholder="Question text"
			/>

			<div
				v-for="(option, oIndex) in question.options"
				:key="'option-' + index + '-' + oIndex"
				class="option"
			>
				<label :for="'option-' + index + '-' + oIndex"
					>{{ categories[oIndex].name }}:</label
				>
				<input
					type="text"
					:id="'option-' + index + '-' + oIndex"
					v-model="option.text"
					placeholder="Option text"
				/>
			</div>

			<button @click="removeQuestion(index)">Remove Question</button>
		</div>

		<button @click="addQuestion">Add Question</button>

		<div
			v-for="(category, index) in categories"
			:key="'feedback-' + index"
			class="feedback"
		>
			<label :for="'feedback-' + index"
				>Feedback for {{ category.name }}:</label
			>
			<textarea
				:id="'feedback-' + index"
				v-model="category.feedback"
				placeholder="Enter feedback"
			></textarea>
		</div>

		<button @click="submitQuiz">Save Quiz</button>
	</div>
</template>

<script>
export default {
	emit: ["save-quiz"],
	props: ["loadedJson"],
	data() {
		return {
			question_text: "",
			numCategories: 1,
			categories: [{ name: "", feedback: "" }],
			questions: [],
		};
	},
	watch: {
		numCategories(val) {
			if (val > this.categories.length) {
				this.categories.push({ name: "", feedback: "" });
			} else if (val < this.categories.length) {
				this.categories.pop();
			}
		},
	},
	methods: {
		addQuestion() {
			const options = this.categories.map(() => ({ text: "" }));
			this.questions.push({ text: "", options });
		},
		removeQuestion(index) {
			this.questions.splice(index, 1);
		},
		updateQuestionOptions() {
			if (!this.questions) {
				return;
			}

			this.questions.forEach((question) => {
				// Remove excess options if any
				if (question.options.length > this.categories.length) {
					question.options.splice(this.categories.length);
				}

				// Add new options if needed
				while (question.options.length < this.categories.length) {
					question.options.push({ text: "" });
				}
			});
		},

		validateCategories() {
			// Check if any category has an empty name
			if (this.categories.some((category) => category.name.trim() === "")) {
				alert("Please ensure all categories have a name.");
				return false;
			}

			// Check for duplicate category names
			const uniqueCategoryNames = new Set(
				this.categories.map((category) => category.name.trim())
			);
			if (uniqueCategoryNames.size !== this.categories.length) {
				alert("Please ensure all categories have unique names.");
				return false;
			}

			return true;
		},

		submitQuiz() {
			// Validate categories before submitting the quiz
			if (!this.validateCategories()) {
				return;
			}

			this.$emit("save-quiz", {
				question_text: this.question_text,
				categories: this.categories,
				questions: this.questions,
			});
		},

		populateFromJson() {
			if (this.loadedJson.questions && this.loadedJson.categories) {
				this.questions = this.loadedJson.questions;
				this.categories = this.loadedJson.categories;
				this.numCategories = this.categories.length;
			}
		},
		openModal() {
			document.getElementById("PersonalityinstructionsModal").style.display = "block";
			this.$refs.modalContent.focus();
		},
		closeModalOnClickOutside(event) {
			if (event.target === this.$refs.modalBackdrop) {
				this.closeModal();
			}
		},
		closeModal() {
			document.getElementById("PersonalityinstructionsModal").style.display = "none";
		},
	},
	mounted() {
		if (this.loadedJson) {
			this.populateFromJson();
		}
	},
	watch: {
		loadedJson: {
			deep: true,
			handler(newData) {
				if (newData) {
					this.categories = newData.categories;
					this.questions = newData.questions;
				}
			},
		},
		numCategories(val) {
			// Ensure the value is not less than 1
			if (val < 1) {
				this.numCategories = 1;
				return;
			}

			while (val > this.categories.length) {
				this.categories.push({ name: "", feedback: "" });
			}
			while (val < this.categories.length) {
				this.categories.pop();
			}
		},
		categories: {
			deep: true,
			handler() {
				this.updateQuestionOptions();
			},
		},
	},
};
</script>

<style scoped>
.personalityTest {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.category,
.question,
.feedback {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.option {
	display: flex;
	gap: 0.5rem;
}

button {
	cursor: pointer;
}

label {
	font-weight: bold;
}
</style>
