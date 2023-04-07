<template>
	<div>
		<h2>
			<button class="question-mark-icon" @click="openModal" tabindex="0">
				&#x3F;
			</button>
			Create Graded Quiz
		</h2>
		<div
			id="GradedinstructionsModal"
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
				<button class="close" @click="closeModal" tabindex="0">&times;</button>
				<h2>Create a Graded Quiz</h2>
				<p>Follow these instructions to create a graded quiz:</p>
				<ol>
					<li>
						Click the "Add Question" button to add a new question to your quiz.
						You can add multiple questions this way.
					</li>
					<li>
						For each question, enter the question text in the input field
						labeled "Question".
					</li>
					<li>
						Below each question, you'll see the "Options" section. Each question
						starts with two options. You can add more by clicking the "Add
						Option" button.
					</li>
					<li>
						For each option, enter the option text in the input field labeled
						"Option".
					</li>
					<li>
						Assign a score to each option by entering a number in the input
						field labeled "Score".
					</li>
					<li>
						To remove an option, click the red "Remove option" button next to
						the option. Note that you cannot remove the first option.
					</li>
					<li>
						After setting up your questions and options, scroll down to the
						"Feedbacks" section.
					</li>
					<li>
						Feedbacks are automatically generated based on the score ranges. You
						can add or remove feedbacks by clicking the "Add Feedback" or
						"Remove" buttons, respectively.
					</li>
					<li>
						For each feedback, enter the feedback text in the textarea provided.
					</li>
					<li>
						Once you have set up your questions, options, and feedbacks, click
						the "Save Quiz" button to save your quiz.
					</li>
				</ol>
				<p>Your quiz is now ready to be used!</p>
			</div>
		</div>
		<div v-for="(question, qIndex) in questions" :key="qIndex">
			<label>Question {{ qIndex + 1 }}:</label>
			<input v-model="question.question" />
			<h3>Options:</h3>
			<div v-for="(option, oIndex) in question.options" :key="oIndex">
				<button
					title="Remove option"
					class="remove-button"
					v-if="oIndex != 0"
					@click="removeOption(qIndex, oIndex)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 18 18"
					>
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
					</svg>
				</button>
				<button
					class="remove-button"
					disabled
					title="Can't remove the first option"
					v-else
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 18 18"
					>
						<g transform="translate(-3.375 -3.375)">
							<path
								id="Path_1"
								data-name="Path 1"
								d="M18.246,16.875H11.14c-.345,0-.628.285-.628.76a.678.678,0,0,0,.628.76h7.106a.773.773,0,0,0,0-1.519Z"
								transform="translate(-2.318 -5.26)"
								fill="#ccc"
							/>
							<path
								id="Path_2"
								data-name="Path 2"
								d="M12.375,4.587a7.785,7.785,0,1,1-5.508,2.28,7.737,7.737,0,0,1,5.508-2.28m0-1.212a9,9,0,1,0,9,9,9,9,0,0,0-9-9Z"
								fill="#ccc"
							/>
						</g>
					</svg>
				</button>
				<label>Option {{ oIndex + 1 }}:</label>
				<input v-model="option.text" />
				<label>Score:</label>
				<input type="number" v-model.number="option.score" />
			</div>
			<button @click="addOption(qIndex)">Add Option</button>
		</div>
		<button @click="addQuestion">Add Question</button>
		<h3>Feedbacks:</h3>
		<div v-for="(feedback, index) in balancedFeedbacks" :key="index">
			<span
				>Feedback for scores {{ feedback.minScore }} to
				{{ feedback.maxScore }}:</span
			>
			<textarea @input="updateFeedbackText(index, $event.target.value)">{{
				feedback.text
			}}</textarea>

			<button v-if="index != 0" @click="removeFeedback(index)">Remove</button>
		</div>
		<button @click="addFeedback">Add Feedback</button>

		<button @click="saveQuestions">Save Quiz</button>
	</div>
</template>
<script>
export default {
	props: ["loadedJson"],
	data() {
		return {
			questions: [
				{
					question: "",
					options: [
						{ text: "", score: 0 },
						{ text: "", score: 0 },
					],
				},
			],
			feedbacks: [{ minScore: 0, maxScore: 0, text: "" }],
		};
	},

	methods: {
		addQuestion() {
			this.questions.push({
				question: "",
				options: [
					{ text: "", score: 0 },
					{ text: "", score: 0 },
				],
			});
			this.updateBalancedFeedbacks();
		},
		addOption(qIndex) {
			this.questions[qIndex].options.push({ text: "", score: 0 });
		},
		removeOption(qIndex, oIndex) {
			this.questions[qIndex].options.splice(oIndex, 1);
			this.updateBalancedFeedbacks();
		},
		addFeedback() {
			this.feedbacks.push({ minScore: 0, maxScore: 0, text: "" });
		},

		removeFeedback(index) {
			this.feedbacks.splice(index, 1);
		},
		saveQuestions() {
			const dataQuestions = this.questions.map((question) => ({
				question: question.question,
				options: question.options,
			}));
			this.$emit("update:activity", {
				questions: dataQuestions,
				feedbacks: this.balancedFeedbacks,
			});
		},

		calculateTotalMinScore() {
			let totalMinScore = 0;
			for (let i = 0; i < this.questions.length; i++) {
				const question = this.questions[i];
				let minScore = Infinity;
				for (let j = 0; j < question.options.length; j++) {
					const option = question.options[j];
					if (option.score < minScore) {
						minScore = option.score;
					}
				}
				totalMinScore += minScore;
			}
			return totalMinScore;
		},

		calculateTotalMaxScore() {
			let totalMaxScore = 0;
			for (let i = 0; i < this.questions.length; i++) {
				const question = this.questions[i];
				let maxScore = -Infinity;
				for (let j = 0; j < question.options.length; j++) {
					const option = question.options[j];
					if (option.score > maxScore) {
						maxScore = option.score;
					}
				}
				totalMaxScore += maxScore;
			}
			return totalMaxScore;
		},
		updateBalancedFeedbacks() {
			const feedbacksLength = this.feedbacks.length;
			const totalMaxScore = this.calculateTotalMaxScore();
			const totalMinScore = this.calculateTotalMinScore();
			const rangeSize = Math.floor(
				(totalMaxScore - totalMinScore + 1) / feedbacksLength
			);
			const remainder = (totalMaxScore - totalMinScore + 1) % feedbacksLength;

			const rangeSizes = Array(feedbacksLength).fill(rangeSize);
			for (let i = 0; i < remainder; i++) {
				rangeSizes[i]++;
			}

			let previousMaxScore = totalMinScore - 1;
			for (let index = 0; index < this.feedbacks.length; index++) {
				const currentRangeSize = rangeSizes[index];

				this.feedbacks[index].minScore = previousMaxScore + 1;
				this.feedbacks[index].maxScore = previousMaxScore + currentRangeSize;

				previousMaxScore = this.feedbacks[index].maxScore;
			}
		},
		updateFeedbackText(index, text) {
			this.feedbacks[index].text = text;
		},
		updateFirstFeedbackMinScore() {
			if (this.feedbacks.length > 0) {
				this.feedbacks[0].minScore = this.calculateTotalMinScore();
				this.updateBalancedFeedbacks();
			}
		},
		populateFromJson() {
			if (this.loadedJson.questions && this.loadedJson.feedbacks) {
				this.questions = this.loadedJson.questions;
				this.feedbacks = this.loadedJson.feedbacks;
			}
		},
		openModal() {
			document.getElementById("GradedinstructionsModal").style.display = "block";
			this.$refs.modalContent.focus();
		},
		closeModalOnClickOutside(event) {
			if (event.target === this.$refs.modalBackdrop) {
				this.closeModal();
			}
		},
		closeModal() {
			document.getElementById("GradedinstructionsModal").style.display = "none";
		},
	},
	computed: {
		rangeSizes() {
			const feedbacksLength = this.feedbacks.length;
			const totalMaxScore = this.calculateTotalMaxScore();
			const rangeSize = Math.floor(
				(totalMaxScore - this.feedbacks[0].minScore + 1) / feedbacksLength
			);
			const remainder =
				(totalMaxScore - this.feedbacks[0].minScore + 1) % feedbacksLength;

			const rangeSizes = Array(feedbacksLength).fill(rangeSize);
			for (let i = 0; i < remainder; i++) {
				rangeSizes[i]++;
			}
			return rangeSizes;
		},
		balancedFeedbacks() {
			const feedbacksLength = this.feedbacks.length;
			const totalMaxScore = this.calculateTotalMaxScore();
			const totalMinScore = this.calculateTotalMinScore();
			const rangeSize = Math.floor(
				(totalMaxScore - totalMinScore + 1) / feedbacksLength
			);
			const remainder = (totalMaxScore - totalMinScore + 1) % feedbacksLength;

			const rangeSizes = Array(feedbacksLength).fill(rangeSize);
			for (let i = 0; i < remainder; i++) {
				rangeSizes[i]++;
			}

			let previousMaxScore = totalMinScore - 1;
			return this.feedbacks.map((feedback, index) => {
				const currentRangeSize = rangeSizes[index];
				const minScore = previousMaxScore + 1;
				const maxScore = previousMaxScore + currentRangeSize;
				previousMaxScore = maxScore;

				return {
					...feedback,
					minScore,
					maxScore,
				};
			});
		},
	},
	watch: {
		loadedJson: {
			deep: true,
			handler(newData) {
				if (newData) {
					this.feedbacks = newData.feedbacks;
					this.questions = newData.questions;
				}
			},
		},
		"feedbacks.length"() {
			this.updateBalancedFeedbacks();
		},
		calculateTotalMinScore: {
			handler() {
				this.updateFirstFeedbackMinScore();
			},
			immediate: true,
		},
	},
	mounted() {
		if (this.loadedJson) {
			this.populateFromJson();
		}
	},
};
</script>
