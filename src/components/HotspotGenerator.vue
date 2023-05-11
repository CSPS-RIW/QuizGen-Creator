<template>
  <keep-alive>
    <div>
      <div class="hotspot-generator">
        <h2>
          <button class="question-mark-icon" @click="openModal" tabindex="0">
            &#x3F;
          </button>
          Hotspot Generator
        </h2>
        <div id="HotspotinstructionsModal" class="modal" @click="closeModalOnClickOutside" ref="modalBackdrop">
          <div class="modal-content" @keydown.esc="closeModal" tabindex="-1" ref="modalContent">
            <button class="close" @click="closeModal" tabindex="0">
              &times;
            </button>
            <h2>How to Create a Hotspot</h2>
            <ol>
              <li>
                Choose the type of hotspot activity you want.
                <ul>
                  <li>
                    The Modal Activity will display a message with the
                    associated name of the shape.
                  </li>
                  <li>
                    The Click and find will allow the user to find each item and
                    display a success message when all are found.
                  </li>
                  <li>
                    The Term Association will list all the names of the shapes
                    and display a succes message when the terms are correctly
                    associated.
                  </li>
                </ul>
              </li>
              <li>
                Enter the image URL in the "Image URL" text box, or click
                "browse your device" to upload an image from your device.
              </li>
              <li>
                Click "Load" to load the image into the hotspot generator.
              </li>
              <li>By default, the drawing makes rectangles that you can draw over the surface. If you switch to Draw
                points, you will be able to draw irregular shapes. </li>
              <li>
                Click on the image to create points that define the shape of the
                hotspot area. The first click creates the first point, and each
                subsequent click adds a new point.
              </li>
              <li>
                Connect the last point to the first point by clicking on the
                first point (the yellow circle). This will close and save the shape.
              </li>
              <li>
                Click "Save / Add New Shape" to save the created shape and start
                creating a new shape, if needed.
              </li>
              <li>
                If you want to name the shape, right-click on the shape and select Set Shape Data. "Name Shape" and enter
                a
                name in the prompt that appears.
              </li>
              <li>
                Click "Download HotSpot" to download the hotspot as an
                interactive SVG file.
              </li>
              <li>
                To delete a shape, right click on that shape and click "Delete Shape".
              </li>
              <li>
                Click "Reset" to clear the hotspot generator and start over.
              </li>
              <li>Click "Undo" to undo the last action performed.</li>
            </ol>
          </div>
        </div>
        <div>
          Type of Hotspot:
          <select v-model="htmlUrl" name="setHTML" id="">
            <option value="./interactive-svg-modal.html">Modal activity</option>
            <option value="./interactive-svg-count.html">Click and find</option>
            <option value="./interactive-svg-list.html">
              Term association
            </option>
            <option value="./interactive-svg-link-tooltip.html">
              Links with tooltips
            </option>
          </select>
        </div>
        <div class="ActivityHeader">
          <div>
            <label for="image-file">Browse your device:</label>
            <input type="file" id="image-file" @change="handleImageFileInput" ref="imageFile"
              accept=".jpg,.jpeg,.png,.gif,.ico,.svg,.webp,.bmp" />
          </div>
          <div class="image-input">
            <label for="image-url">or enter an Image URL:</label>
            <input type="text" id="image-url" :value="imageUrl" @input="handleImageUrlInput" />
            &nbsp;<button @click="loadImage">Load</button>
          </div>
        </div>
        <label for="colorInput">Select the fill colour of the resulting SVG</label>
        <input id="colorInput" type="color" v-model="fillColor" v-if="!transparent">
        <label>
          <input type="checkbox" v-model="transparent"> Transparent
        </label>
        <button @click="toggleDrawingMode">
          {{ drawingMode === 'rectangle' ? 'Switch to Draw Points' : 'Switch to Draw Rectangles' }}
        </button>
        <div :class="[
          'svg-container',
          'image-container',
          { 'delete-mode': deleteMode },
        ]" @click="addPoint" ref="container">
          <div v-if="contextMenu.visible" class="context-menu" :style="{
            top: contextMenu.y + 'px',
            left: contextMenu.x + 'px',
            display: contextMenu.visible ? 'block' : 'none',
          }" @click.stop="hideContextMenu">
            <div class="context-menu-item" @click="showShapeProperties()">
              Set shape data
            </div>
            <div class="context-menu-item" @click="deleteShape()">
              Delete shape
            </div>
          </div>
          <svg :viewBox="`0 0 ${imageWidth} ${imageHeight}`" width="100%" height="100%">
            <image :href="image" x="0" y="0" :width="imageWidth" :height="imageHeight" />

            <polygon @click.stop="null" @contextmenu.prevent="showContextMenu($event, index)"
              v-for="(shape, index) in shapes" :key="index" :points="shape.points" :fill="fillColor" opacity="0.3"
              stroke="blue" />

            <text v-for="(shape, index) in shapes" :key="'text-' + index" :x="calculateMiddlePoint(shape).x"
              :y="calculateMiddlePoint(shape).y" text-anchor="middle" font-size="14" font-weight="bold" fill="white"
              style="pointer-events: none">
              {{ shape.name }}
            </text>


            <polygon v-if="points.length > 1" :points="currentShapePoints" fill="rgba(255, 0, 0, 0.3)" stroke="red" />
            <line v-if="points.length > 1" :x1="points[0].x" :y1="points[0].y" :x2="points[points.length - 1].x"
              :y2="points[points.length - 1].y" stroke="white" stroke-dasharray="4,2" />

            <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="5"
              :fill="index === 0 && points.length > 1 ? 'yellow' : 'red'" @click.stop="handleCircleClick(index)" />
            <rect v-if="tempShapes.length > 0 && drawingMode === 'rectangle'" :x="tempShapes[0].x" :y="tempShapes[0].y"
              :width="tempShapes[0].width" :height="tempShapes[0].height" fill="none" stroke="red" />
          </svg>
        </div>
        <button @click="newShape" v-if="points.length > 1">
          Save / Add New Shape
        </button>
        <button @click="undo" :disabled="!lastAction" v-if="points.length || shapes.length || lastDeletedShape">
          Undo
        </button>
        <button @click="downloadSVG" v-if="shapes.length">
          Download HotSpot
        </button>
        <button @click="reset" v-if="points.length || shapes.length">
          Reset
        </button>
      </div>
      <div ref="shapePropertiesModal" class="modal" id="shapePropertiesModal" @click.self="closeShapePropertiesModal">
        <div class="modal-content">
          <h3>Shape Properties</h3>
          <label>
            Name:
            <input v-model="selectedShape.name" type="text" />
          </label>
          <div>
            <label>
              Description:
              <textarea v-model="selectedShape.description" type="text"></textarea>
            </label>
          </div>
          <div v-if="htmlUrl == `./interactive-svg-link-tooltip.html`">
            <label>
              Link (href):
              <select v-model="selectedShape.linkPrefix">
                <option value="http://">http://</option>
                <option value="https://" selected>https://</option>
                <option value="">none</option>
              </select>
              <input v-model="selectedShape.link" type="text" />
            </label>
            <div class="target">
              <label for="open-in-new-window">Open in:</label>
              <label>
                <input type="radio" id="open-in-new-window" value="_blank" v-model="selectedShape.target" />
                <span>New window</span>
              </label>
              <label>
                <input type="radio" id="open-in-same-window" value="_self" v-model="selectedShape.target" />
                <span>Same window</span>
              </label>
            </div>

            <label>
              Tooltip:
              <input v-model="selectedShape.tooltip" type="text" />
            </label>
          </div>
          <button @click="saveShapeProperties">Save</button>
          <button @click="closeShapePropertiesModal">Cancel</button>
        </div>
      </div>
    </div>
  </keep-alive>
</template>

<script>
export default {
  name: "HotspotGenerator",
  emit: ["update:image"],
  data() {
    return {
      fillColor: '#0000ff', // Default fill color
      transparent: true, // Default to non-transparent
      drawingMode: 'rectangle', // or 'point'
      dragStart: null,
      dragging: false,
      tempShapes: [],
      contextMenu: {
        x: 0,
        y: 0,
        visible: false,
      },
      imageUrl: "",
      htmlUrl: "./interactive-svg-modal.html",
      image: null,
      imageWidth: 0,
      imageHeight: 0,
      points: [],
      shapes: [],
      deleteMode: false,
      lastAction: null, // New property to store the last action
      lastDeletedShape: null, // New property to store the last deleted shape
      selectedShapeIndex: -1,
      selectionMode: false,
      showShapePropertiesModal: false,
      selectedShape: {
        index: -1,
        name: "",
        linkPrefix: "https://",
        link: "",
        target: "_blank",
        tooltip: "",
      },
    };
  },
  computed: {
    currentShapePoints() {
      const points = [...this.points, this.points[0]];
      return points.map((point) => `${point.x},${point.y}`).join(" ");
    },
  },
  methods: {
    toggleDrawingMode() {
      this.drawingMode = this.drawingMode === 'rectangle' ? 'point' : 'rectangle';
    },
    handleImageUrlInput(event) {
      if (!this.imageUrlValid(event.target.value)) {
        // Check if the URL is valid
        alert("Invalid URL");
        return;
      }
      this.imageUrl = event.target.value;
    },
    handleImageFileInput(event) {
      this.loadLocalImage(event);
      this.imageUrl = "";
    },
    clearFileInput() {
      if (this.$refs.imageFile) {
        this.$refs.imageFile.value = "";
      }
    },
    async loadImage() {
      if (!this.imageUrlValid(this.imageUrl)) {
        alert("Invalid URL");
        return;
      }

      try {
        const response = await fetch(this.imageUrl);

        if (!response.ok) {
          alert("Failed to load image");
          return;
        }

        const blob = await response.blob();
        const img = new Image();
        img.onload = async () => {
          const resizedImg = await this.resizeImageIfNeeded(img);
          this.imageLoaded(resizedImg);
        };
        img.src = URL.createObjectURL(blob);
      } catch (error) {
        alert("Error occurred while loading the image");
      }
    },

    imageUrlValid(url) {
      // return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
      return true;
    },

    async loadLocalImage(event) {
      const file = event.target.files[0];
      if (file) {
        const img = new Image();
        img.onload = async () => {
          const resizedImg = await this.resizeImageIfNeeded(img);
          this.imageLoaded(resizedImg);
        };
        img.src = URL.createObjectURL(file);
      }
    },

    imageLoaded(img) {
      this.image = this.toDataURL(img);
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.setContainerSize();
    },

    toDataURL(img) {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      return canvas.toDataURL();
    },

    async resizeImageIfNeeded(img) {
      const maxWidth = 800;
      const maxHeight = 1600;

      if (img.width <= maxWidth && img.height <= maxHeight) {
        return img;
      }

      const accepted = confirm(
        "The image is too large. Do you want to scale it down to fit the recommended dimensions?"
      );

      if (!accepted) {
        return img;
      }

      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      return new Promise((resolve) => {
        const resizedImg = new Image();
        resizedImg.src = canvas.toDataURL();
        resizedImg.onload = () => {
          resolve(resizedImg);
        };
      });
    },
    async setContainerSize() {
      const container = this.$refs.container;
      const aspectRatio = this.imageHeight / this.imageWidth;

      const containerWidth = container.clientWidth;
      const containerHeight = containerWidth * aspectRatio;

      container.style.height = `${containerHeight}px`;
    },

    getSVGCoordinates(event) {
      const svg = this.$refs.container.querySelector("svg");
      const rect = svg.getBoundingClientRect();
      const scaleX = this.imageWidth / rect.width;
      const scaleY = this.imageHeight / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      return { x, y };
    },
    startDrag(event) {
      if (this.drawingMode !== 'rectangle') return;
      const { x, y } = this.getSVGCoordinates(event);
      this.dragStart = { x, y };
      this.dragging = true;
    },

    drag(event) {
      if (!this.dragging || this.drawingMode !== 'rectangle') return;
      const { x, y } = this.getSVGCoordinates(event);
      const rect = {
        x: Math.min(this.dragStart.x, x),
        y: Math.min(this.dragStart.y, y),
        width: Math.abs(this.dragStart.x - x),
        height: Math.abs(this.dragStart.y - y),
      };

      // Add the rectangle to the temporary shapes array
      this.tempShapes = [rect];
    },

    endDrag(event) {
      if (!this.dragging || this.drawingMode !== 'rectangle') return;

      // The dragging has ended
      this.dragging = false;

      // Get the final mouse position
      const { x, y } = this.getSVGCoordinates(event);
      if(x == this.dragStart.x || y == this.dragStart.y) return;

      // Calculate the four points of the rectangle (top-left, top-right, bottom-right, bottom-left)
      const points = [
        { x: this.dragStart.x, y: this.dragStart.y }, // top-left
        { x: x, y: this.dragStart.y }, // top-right
        { x: x, y: y }, // bottom-right
        { x: this.dragStart.x, y: y }, // bottom-left
      ];

      const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

      // Push the points string to the shapes array
      this.shapes.push({ points: pointsStr, name: "" });

      // Clear the temporary shapes array
      this.tempShapes = [];
    },


    addPoint(event) {
      if (this.deleteMode || this.contextMenu.visible || this.drawingMode == 'rectangle') return;

      this.setContainerSize();
      const rect = this.$refs.container.getBoundingClientRect();
      const { x: rawX, y: rawY } = this.getSVGCoordinates(event);

      // Round coordinates to the first decimal
      const x = parseFloat(rawX.toFixed(1));
      const y = parseFloat(rawY.toFixed(1));

      // Check if the yellow circle was clicked
      if (
        this.points.length > 1 &&
        Math.sqrt(
          Math.pow(x - this.points[0].x, 2) + Math.pow(y - this.points[0].y, 2)
        ) <= 10
      ) {
        return;
      }

      // Add points depending on the drawing mode
      if (this.drawingMode === 'point') {
        this.points.push({ x, y });
      }

      this.lastAction = "addPoint"; // Update last action
    },


    newShape() {
      const shapePoints = this.points
        .map((point) => `${point.x},${point.y}`)
        .join(" ");
      this.shapes.push({ points: shapePoints, name: "" });
      this.points = [];
      this.lastAction = "newShape"; // Update last action
    },
    handleCircleClick(index) {
      if (index === 0 && this.points.length > 2) {
        this.newShape();
      }
    },
    downloadSVG() {
      const xmlns = "http://www.w3.org/2000/svg";
      const xlinkns = "http://www.w3.org/1999/xlink";
      const svgElem = document.createElementNS(xmlns, "svg");
      svgElem.setAttributeNS(null, "width", this.imageWidth);
      svgElem.setAttributeNS(null, "height", this.imageHeight);

      const imageElem = document.createElementNS(xmlns, "image");
      imageElem.setAttributeNS(null, "href", this.image);
      imageElem.setAttributeNS(null, "x", 0);
      imageElem.setAttributeNS(null, "y", 0);
      imageElem.setAttributeNS(null, "width", this.imageWidth);
      imageElem.setAttributeNS(null, "height", this.imageHeight);
      svgElem.appendChild(imageElem);

      const tooltipDivs = [];

      this.shapes.forEach((shape, index) => {
        const polygon = document.createElementNS(xmlns, "polygon");
        polygon.setAttributeNS(null, "points", shape.points);
        polygon.setAttributeNS(null, "fill", this.transparent ? "transparent" : this.fillColor);
        polygon.setAttributeNS(null, "stroke", "transparent");
        polygon.setAttributeNS(null, "opacity", "0.3");

        const anchor = document.createElementNS(xmlns, "a");
        anchor.setAttributeNS(
          null,
          "href",
          shape.link ? shape.linkPrefix + shape.link : "javascript:;"
        );
        anchor.setAttributeNS(null, "id", `shape-${index}`);
        anchor.setAttributeNS(null, "title", shape.name);
        anchor.setAttributeNS(null, "data-description", shape.description);
        anchor.setAttributeNS(null, "data-tooltip", shape.name);
        anchor.setAttributeNS(null, "tabindex", 0);

        if (
          shape.tooltip &&
          this.htmlUrl == "./interactive-svg-link-tooltip.html"
        ) {
          anchor.classList.add("acc_tooltip");
          anchor.setAttribute("target", shape.target);
          anchor.setAttribute("data-tooltip-id", `tooltip-${index}`);

          const tooltipDiv = document.createElement("div");
          tooltipDiv.id = `tooltip-${index}`;
          tooltipDiv.classList.add("popup");
          tooltipDiv.role = "tooltip";
          tooltipDiv.innerHTML = shape.tooltip;
          tooltipDivs.push(tooltipDiv);
        }

        if (shape.link) {
          anchor.setAttributeNS(null, "data-link", shape.link);
        }

        anchor.appendChild(polygon);
        svgElem.appendChild(anchor);
      });

      const svgData = new XMLSerializer().serializeToString(svgElem);

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      const links = svgDoc.querySelectorAll('a[href="javascript:;"]');
      links.forEach(function (link) {
        if (link.hasAttribute("data-link")) {
          link.setAttributeNS(xlinkns, "href", link.getAttribute("data-link"));
          link.removeAttribute("data-link");
        }
      });

      const updatedSvgData = new XMLSerializer().serializeToString(
        svgDoc.documentElement
      );

      fetch(this.htmlUrl)
        .then((response) => response.text())
        .then((htmlTemplate) => {
          let updatedHtmlTemplate = htmlTemplate.replace(
            '<div id="svg-container">',
            '<div id="svg-container">' + updatedSvgData
          );

          tooltipDivs.forEach((tooltipDiv) => {
            updatedHtmlTemplate = updatedHtmlTemplate.replace(
              "</div>",
              "</div>" + tooltipDiv.outerHTML
            );
          });

          const blob = new Blob([updatedHtmlTemplate], {
            type: "text/html;charset=utf-8",
          });

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "interactive-svg.html";
          link.click();
          URL.revokeObjectURL(url);
        });
    },

    closeShapePropertiesModal() {
      // this.selectionMode = true;
      document.getElementById("shapePropertiesModal").style.display = "none";
      this.showShapePropertiesModal = false;
    },
    saveShapeProperties() {
      this.shapes[this.selectedShapeIndex].name = this.selectedShape.name;
      this.shapes[this.selectedShapeIndex].description = this.selectedShape.description;
      this.shapes[this.selectedShapeIndex].link = this.selectedShape.link;
      this.shapes[this.selectedShapeIndex].target = this.selectedShape.target;
      this.shapes[this.selectedShapeIndex].linkPrefix =
        this.selectedShape.linkPrefix;
      this.shapes[this.selectedShapeIndex].tooltip = this.selectedShape.tooltip;

      this.showShapePropertiesModal = false;
      this.closeShapePropertiesModal();
      this.selectionMode = false;
    },
    calculateMiddlePoint(shape) {
      if (!shape) {
        return { x: 0, y: 0 };
      };
      let points = shape.points;
      if (!points) {
        return { x: 0, y: 0 };
      }
      let xSum = 0;
      let ySum = 0;
      let pointArray = points
        .split(" ")
        .map((point) => point.split(",").map(Number));
      for (let i = 0; i < pointArray.length; i++) {
        xSum += pointArray[i][0];
        ySum += pointArray[i][1];
      }
      const xAvg = xSum / pointArray.length;
      const yAvg = ySum / pointArray.length;
      return { x: xAvg, y: yAvg };
    },



    reset() {
      if (window.confirm("Are you sure you want to reset the activity?")) {
        this.points = [];
        this.shapes = [];
        this.image = null;
        this.imageUrl = "";
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.clearFileInput();
      }
    },
    showContextMenu(event, index) {
      // Get the SVG coordinates
      const { x, y } = this.getSVGCoordinates(event);

      // Calculate the SVG container's position and scale
      const svg = this.$refs.container.querySelector("svg");
      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width / this.imageWidth;
      const scaleY = rect.height / this.imageHeight;

      // Calculate contextMenu position
      let contextMenuX = x * scaleX;
      let contextMenuY = y * scaleY;

      // Make the context menu visible to get its dimensions
      this.contextMenu.visible = true;
      this.$nextTick(() => {
        const contextMenuElement = this.$el.querySelector(".context-menu");

        // Adjust the position considering the context menu dimensions
        if (contextMenuX + contextMenuElement.offsetWidth > rect.right) {
          contextMenuX = rect.right - contextMenuElement.offsetWidth;
        }

        if (contextMenuY + contextMenuElement.offsetHeight > rect.bottom) {
          contextMenuY = rect.bottom - contextMenuElement.offsetHeight;
        }

        // Set the context menu position
        this.contextMenu.x = contextMenuX;
        this.contextMenu.y = contextMenuY;
        this.selectedShapeIndex = index;
      });
    },


    hideContextMenu() {
      this.contextMenu.visible = false;
    },

    showShapeProperties() {
      this.selectedShape.name = this.shapes[this.selectedShapeIndex].name;
      this.selectedShape.description =
        this.shapes[this.selectedShapeIndex].description || "";
      this.selectedShape.link = this.shapes[this.selectedShapeIndex].link || "";
      this.selectedShape.tooltip =
        this.shapes[this.selectedShapeIndex].tooltip || "";

      // Show the modal
      this.showShapePropertiesModal = true;
      document.getElementById("shapePropertiesModal").style.display = "block";
    },

    deleteShape() {
      this.lastDeletedShape = this.shapes.splice(this.selectedShapeIndex, 1)[0]; // Store the deleted shape
      this.lastAction = "deleteShape"; // Update last action
      this.deleteMode = false;
      this.hideContextMenu();
    },

    undo() {
      if (this.lastAction === "addPoint") {
        this.points.pop();
      } else if (this.lastAction === "newShape") {
        const shapePoints = this.shapes[this.shapes.length - 1].points
          .split(" ")
          .map((point) => {
            const [x, y] = point.split(",");
            return { x: parseInt(x), y: parseInt(y) };
          });
        this.points = shapePoints;
        this.shapes.pop();
      } else if (this.lastAction === "deleteShape") {
        this.shapes.push(this.lastDeletedShape);
        this.lastDeletedShape = null;
      }
      this.lastAction = null;
    },
    keydownHandler(event) {
      if (event.key === "z" || event.key === "Z") {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.undo();
        }
      }
    },
    openModal() {
      document.getElementById("HotspotinstructionsModal").style.display =
        "block";
      this.$refs.modalContent.focus();
    },
    closeModalOnClickOutside(event) {
      if (event.target === this.$refs.modalBackdrop) {
        this.closeModal();
      }
    },
    closeModal() {
      document.getElementById("HotspotinstructionsModal").style.display =
        "none";
    },
  },
  watch: {
    image(newImage) {
      if (newImage) {
        this.$nextTick().then(() => {
          this.setContainerSize();
        });
      }
    },
    imageUrl() {
      this.clearFileInput();
    },
    shapes: {
      deep: true,
      handler() {
        this.$emit("update:shapes", this.shapes);
      },
    },
  },

  mounted() {
    document.addEventListener("click", this.hideContextMenu);
    const svg = this.$refs.container.querySelector("svg");
    svg.addEventListener("mousedown", this.startDrag);
    svg.addEventListener("mousemove", this.drag);
    svg.addEventListener("mouseup", this.endDrag);
  },
  created() {
    document.addEventListener("keydown", this.keydownHandler);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("click", this.hideContextMenu);
    const svg = this.$refs.container.querySelector("svg");
    svg.removeEventListener("mousedown", this.startDrag);
    svg.removeEventListener("mousemove", this.drag);
    svg.removeEventListener("mouseup", this.endDrag);
  },
};
</script>

<style>
.hotspot-generator {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.image-input {
  margin-bottom: 20px;
}

.image-container {
  cursor: pointer;
  position: relative;
  display: inline-block;
}

.image-container.delete-mode {
  cursor: crosshair;
}

.svg-container {
  max-width: 100vw;
  /* Set the maximum width to 100% of the viewport width */
  max-height: 100vh;
  /* Set the maximum height to 100% of the viewport height */
  overflow: auto;
  /* Add scrollbars if the content is larger than the container */
}

svg {
  width: 100%;
  /* Set the width to 100% of its container */
  height: auto;
  /* Set the height to maintain the aspect ratio */
  display: block;
  /* Set the display to block to remove extra space below the SVG */
}

.image-container svg {
  position: absolute;
  top: 0;
  left: 0;
}

.hoverable:hover {
  fill: rgba(0, 160, 0, 0.4);
}

.selected-shape {
  outline: 2px solid #007bff;
}

.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.target {
  display: inline-flex;
  flex-direction: column;
  font-size: 12px;
  padding: 1rem;
}

.target input[type="radio"] {
  display: initial !important;
}

.context-menu {
  position: absolute;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.context-menu-item:hover {
  background-color: #f1f1f1;
}
</style>
