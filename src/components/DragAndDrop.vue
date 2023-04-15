<template>
	<div class="drag-and-drop">
		<h3>Drag and Drop Activity</h3>
		<label for="item-count">Number of Draggable Items:</label>
		<input
			type="number"
			id="item-count"
			v-model.number="itemCount"
			min="1"
			@change="createItems"
		/>

		<div v-if="items.length > 0">
			<div v-for="(item, index) in items" :key="index" class="item-pair">
				<label :for="'draggable-' + index"
					>Draggable Item {{ index + 1 }}:</label
				>
				<input
					type="text"
					:id="'draggable-' + index"
					v-model="item.draggable"
				/>

				<label :for="'dropzone-' + index">Drop Zone {{ index + 1 }}:</label>
				<input type="text" :id="'dropzone-' + index" v-model="item.dropzone" />
			</div>
		</div>

		<button @click="saveActivity">Save Activity</button>
	</div>
</template>

<script>
export default {
	props: ["loadedJson"],
	data() {
		return {
			itemCount: this.loadedJson.answer_options.length||1,
			items: this.loadedJson.answer_options||[],
		};
	},
	methods: {
		createItems() {
			this.items = Array.from({ length: this.itemCount }, () => ({
				draggable: "",
				dropzone: "",
			}));
		},
		saveActivity() {
			this.$emit("update:activity", {
				activity_type: "drag-and-drop",
				items: this.items,
			});
		},
	},
	created() {
		this.createItems();
	},
	watch: {
		loadedJson: {
			deep: true,
			handler(newLoadedJson){
				if (newLoadedJson.question_type == "drag-and-drop") {
					this.items = newLoadedJson.answer_options;
					this.itemCount = newLoadedJson.answer_options.length;
				}
			},
		},
	},
};
</script>

<style scoped>
.drag-and-drop {
	display: flex;
	flex-direction: column;
}

.item-pair {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
}

input[type="text"] {
	flex: 1;
	margin-left: 0.5rem;
}

input[type="number"] {
	width: 50px; /* Adjust to your desired size */
	height: 50px; /* Adjust to your desired size */
	font-size: 1.5rem; /* Adjust to your desired font size */
	text-align: center;
}
</style>
