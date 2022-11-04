<template>
  <div class="settings d-flex" v-if="isFocused" style="z-index: 1000">
    <div class="d-flex flex-column border-end border-secondary my-2 px-2">
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Actions</label
      >
      <button
        class="btn btn-outline-secondary"
        title="duplicate"
        @click="duplicate"
      >
        <font-awesome-icon icon="fa-solid fa-copy" />
      </button>
    </div>
    <div
      class="d-flex flex-column border-end border-secondary my-2 px-2"
      v-if="modelValue.colors != null"
    >
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Fill</label
      >
      <div class="d-flex">
        <div v-for="index in colors.length" :key="index" class="p-2">
          <label class="form-label text-nowrap">Color {{ index }}</label>
          <input
            type="color"
            :id="'color' + index"
            class="form-control form-control-color m-auto"
            :name="'color' + index"
            v-model="colors[index - 1]"
            @change="updateModelValue({ colors: colors })"
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Opacity</label>
          <!-- https://stackoverflow.com/questions/47311936/v-model-and-child-components -->
          <input
            type="number"
            step=".01"
            class="form-control form-control-small m-auto text-center"
            :value="modelValue.opacity"
            @change="
              updateModelValue({
                opacity: Math.max(Math.min($event.target.value, 1), 0),
              })
            "
          />
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column border-end border-secondary my-2 px-2"
      v-if="modelValue.font != null"
    >
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Font</label
      >
      <div class="d-flex">
        <div class="p-2">
          <label class="form-label text-nowrap">Color</label>
          <input
            type="color"
            class="form-control form-control-color m-auto"
            :value="modelValue.font.color"
            @input="
              updateModelValue({
                font: { ...modelValue.font, color: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Font</label>
          <select
            class="form-select w-auto"
            :value="modelValue.font.family"
            @input="
              updateModelValue({
                font: { ...modelValue.font, family: $event.target.value },
              })
            "
          >
            <option v-for="font in fonts.sort()" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Size</label>
          <input
            type="number"
            class="form-control form-control-small m-auto text-center"
            :value="modelValue.font.size"
            @input="
              updateModelValue({
                font: { ...modelValue.font, size: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Bold</label>
          <button
            :class="`btn btn-outline-secondary d-block ${
              modelValue.font.bold ? 'active' : ''
            }`"
            @click="
              updateModelValue({
                font: { ...modelValue.font, bold: !modelValue.font.bold },
              })
            "
          >
            <font-awesome-icon icon="fa-solid fa-bold" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["id", "modelValue"],
  emits: [
    "update:modelValue",
    "delete",
    "moveToFront",
    "moveUp",
    "moveDown",
    "moveToBack",
    "duplicate",
  ],
  data() {
    return {
      visible: true,
      rotation: 0,
      offsetTop: 0,
      offsetLeft: 0,
      isFocused: false,
      color: "#00ff00",
      colors: [],
      fontSize: null,
      fonts: [
        "Amatic SC",
        "Cookie",
        "Homemade Apple",
        "Ms Madi",
        "Rouge Script",
        "Sacramento",
        "Shadows Into Light",
        "Shadows Into Light Two",
        "Sue Ellen Francisco",
        "Tillana",
      ],
      borderStyles: ["Solid", "Dotted", "Dashed", "Double"],
    };
  },
  computed: {
    trueRotation() {
      return ((this.modelValue.rotation % 360) + 360) % 360;
    },
    rotationRadians() {
      return (this.modelValue.rotation / 180) * Math.PI;
    },
    ratio() {
      let h = this.modelValue.dimensions.height;
      let w = this.modelValue.dimensions.width;
      let H = this.boundingBox.dimensions.height;
      let W = this.boundingBox.dimensions.width;
      let x = W - ((h / w) * (H - (h / w) * W)) / (1 - (h / w) ** 2);
      let y = (H - (h / w) * W) / (1 - (h / w) ** 2);
      return x / y;
    },
    boundingBox() {
      return this.calculateBoundingBox(this.modelValue.dimensions);
    },
  },
  methods: {
    click() {
      $(document).trigger("mousedown");
      this.$refs.sticker.click();
    },
    focusSticker() {
      this.isFocused = true;
    },
    updateModelValue(newValues) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        ...newValues,
      });
    },
    deleteSticker() {
      this.$emit("delete", this.id);
    },
    moveToFront() {
      this.$emit("moveToFront", this.id);
    },
    moveUp() {
      this.$emit("moveUp", this.id);
    },
    moveDown() {
      this.$emit("moveDown", this.id);
    },
    moveToBack() {
      this.$emit("moveToBack", this.id);
    },
    duplicate() {
      this.$emit("duplicate", this.id);
    },
    calculateBoundingBox(dim) {
      let diameter = Math.sqrt(dim.height ** 2 + dim.width ** 2);
      let angle = (Math.atan(dim.width / dim.height) * 180) / Math.PI;

      // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
      const rotationAngle = ((this.modelValue.rotation + 90) % 180) - 90;

      let dimensions = {
        width:
          diameter *
          Math.max(
            Math.abs(
              Math.cos(Math.abs(angle + rotationAngle - 90) * (Math.PI / 180))
            ),
            Math.abs(
              Math.cos(Math.abs(-angle + rotationAngle - 90) * (Math.PI / 180))
            )
          ),
        height:
          diameter *
          Math.max(
            Math.abs(
              Math.sin(Math.abs(angle + rotationAngle - 90) * (Math.PI / 180))
            ),
            Math.abs(
              Math.sin(Math.abs(-angle + rotationAngle - 90) * (Math.PI / 180))
            )
          ),
      };

      let margins = {
        top: (dimensions.height - dim.height) / 2,
        left: (dimensions.width - dim.width) / 2,
      };

      return { dimensions, margins };
    },
    updateOffset() {
      var cell1 = document.getElementById("1-1"); // TODO: fix this
      // https://stackoverflow.com/questions/46451319/access-el-inside-a-computed-property
      // https://stackoverflow.com/questions/11634770/get-position-offset-of-element-relative-to-a-parent-container
      this.offsetTop = cell1.offsetTop;
      this.offsetLeft = cell1.offsetLeft;
    },
  },
  beforeUpdate() {
    this.colors = this.modelValue.colors || [];
  },
};
</script>

<style scoped>
.settings {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #e8e8e8;
}

.form-control-small {
  width: 4rem;
  height: auto;
  padding: 0.375rem;
}
</style>
