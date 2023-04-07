<template>
	<div>
		<label for="sentence"
			>Enter a sentence with blanks (use triple underscores ___ for
			blanks):</label
		>
		<input
			id="sentence"
			type="text"
			v-model="sentence"
			@input="onInputChange"
		/>
		<div v-for="(options, index) in blanksOptions" :key="index">
			<h4>Options for blank {{ index + 1 }}:</h4>
			<div v-for="(option, optionIndex) in options" :key="optionIndex">
				<button
					@click.prevent="removeOption(index, optionIndex)"
					title="Remove option"
					class="remove-button"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="38"
						height="38"
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
				<input
					type="text"
					v-model="option.text"
					:placeholder="optionIndex === 0 ? 'Default (unselected) text' : 'Option'"
				/>
				<input
					:id="'correctOption' + questionIndex + index + optionIndex"
					type="radio"
					:value="optionIndex"
					:disabled="optionIndex === 0"
					v-model="option.correctIndex"
					@change="markCorrect(index, optionIndex)"
				/>
				<label :for="'correctOption' + questionIndex + index + optionIndex">{{
					option.correctIndex !== null ? "Correct" : ""
				}}</label>
			</div>
			<button class="add-option" @click.prevent="addOption(index)">
				Add Option
			</button>
		</div>
		<br />
		<button @click="saveSentence">Save Sentence</button>
	</div>
</template>

<script>
export default {
	props: {
		questionIndex: { type: Number },
		loadedJson: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			sentence: "",
			savedSentence: "",
			blanksOptions: [],
			savedOptions: [],
		};
	},
	computed: {
		displayedSentence() {
			let result = this.savedSentence;
			this.savedOptions.forEach((options, index) => {
				const correctOption = options.find(
					(option) => option.correctIndex !== null
				);
				const correctIndex = correctOption ? correctOption.correctIndex : null;
				if (correctIndex !== null) {
					const selectOptions = options
						.map(
							(option, i) =>
								`<option ${i === correctIndex ? "selected" : ""}>${
									option.text
								}</option>`
						)
						.join("");
					const selectElement = `<select>${selectOptions}</select>`;
					result = result.replace("___", selectElement);
				}
			});
			return result;
		},
	},
	methods: {
		onInputChange() {
			const blankCount = (this.sentence.match(/___/g) || []).length;
			while (blankCount > this.blanksOptions.length) {
				this.blanksOptions.push([{ text: "", correctIndex: null }]);
			}
			while (blankCount < this.blanksOptions.length) {
				this.blanksOptions.splice(-1, 1);
			}
		},

		saveSentence() {
			if (!this.sentence.includes("___")) {
				alert("Please include at least one blank (___) in the sentence.");
				return;
			}

			for (const options of this.blanksOptions) {
				if (!options.some((option) => option.correctIndex !== null)) {
					alert("Please select a correct option for each blank.");
					return;
				}
			}

			this.savedSentence = this.sentence;
			this.savedOptions = JSON.parse(JSON.stringify(this.blanksOptions));
			this.updateQuestion();
		},

		updateQuestion() {
			this.$emit("update:question", {
				question_type: "fill-in-the-blanks",
				question_text: this.savedSentence,
				answer_options: this.savedOptions.map((options) => {
					return {
						options: options.map((option) => option.text),
						correctIndex: options.find((option) => option.correctIndex !== null)
							.correctIndex,
					};
				}),
			});
		},

		addOption(index) {
			const newOption = { text: "", correctIndex: null };
			this.blanksOptions[index].push(newOption);
			if (this.blanksOptions[index].length === 2) {
				// Set the second option's correctIndex to 1
				this.blanksOptions[index][1].correctIndex = 1;
			}
		},
		removeOption(index, optionIndex) {
			this.blanksOptions[index].splice(optionIndex, 1);
		},
		markCorrect(index, optionIndex) {
			this.blanksOptions[index].forEach((option, i) => {
				if (i !== optionIndex) {
					option.correctIndex = null;
				}
			});
		},
		populateFromJson() {
			if (this.loadedJson.question_text && this.loadedJson.answer_options) {
				this.sentence = this.loadedJson.question_text;
				this.savedSentence = this.loadedJson.question_text;
				this.blanksOptions = this.loadedJson.answer_options.map(
					({ options, correctIndex }) => {
						return options.map((text, i) => {
							return {
								text,
								correctIndex: i === correctIndex ? i : null,
							};
						});
					}
				);
			}
		},
	},
	mounted() {
		if (this.loadedJson) {
			this.populateFromJson();
		}
	},
};
</script>

<style scoped>
body {
	font-family: Arial, sans-serif;
}

input[type="text"],
select {
	padding: 5px;
	font-size: 14px;
	border: 1px solid #ccc;
	border-radius: 4px;
	margin-bottom: 10px;
}

input[type="radio"] {
	margin-left: 10px;
}

button {
	border: none;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 14px;
	margin: 4px 2px;
	cursor: pointer;
	border-radius: 4px;
	box-shadow: none;
}

label {
	margin-left: 5px;
	font-size: 14px;
}

h4 {
	margin-bottom: 5px;
}

h3 {
	margin-top: 20px;
	margin-bottom: 10px;
}

.saved-sentence {
	margin-top: 20px;
	padding: 10px;
	background-color: #f5f5f5;
	border-radius: 4px;
}
</style>
