<template>
  <div>
    <div
      ref="sticker"
      :class="
        'position-absolute ' +
        (this.isFocused && false ? 'border border-rounded' : '')
      "
      :style="
        'transform: rotate(' +
        this.modelValue.rotation -
        this.modelValue.rotation +
        'deg); top: ' +
        (this.modelValue.position.top + this.offsetTop) +
        'px; left: ' +
        (this.modelValue.position.left + this.offsetLeft) +
        'px; ' +
        (this.isFocused ? ' z-index: 100;' : '') +
        'width: ' +
        boundingBox.dimensions.width +
        'px; height: ' +
        boundingBox.dimensions.height +
        'px; opacity: ' +
        this.modelValue.opacity +
        ';'
      "
      v-if="visible"
      @click="focusSticker"
    >
      <div
        class="position-absolute"
        :style="
          'transform: rotate(' +
          this.modelValue.rotation +
          'deg); margin-top: ' +
          boundingBox.margins.top +
          'px; margin-left: ' +
          boundingBox.margins.left +
          'px;'
        "
      >
        <div
          :style="
            (this.isFocused ? 'opacity: 75%;' : '') +
            'width: ' +
            this.modelValue.dimensions.width +
            'px; height: ' +
            this.modelValue.dimensions.height +
            'px;'
          "
        >
          <slot></slot>
          <div
            v-if="modelValue.border"
            class="position-absolute sticker-border"
            v-on:click.self.prevent
            :style="`width: calc(100% - ${
              2 * modelValue.border.inset * (modelValue.border.on || 0)
            }px);
              height: calc(100% - ${
                2 * modelValue.border.inset * (modelValue.border.on || 0)
              }px);
              top: ${modelValue.border.inset * (modelValue.border.on || 0)}px;
              left: ${modelValue.border.inset * (modelValue.border.on || 0)}px;
              border: ${
                modelValue.border.width * (modelValue.border.on || 0)
              }px ${modelValue.border.style} ${modelValue.border.color};`"
          >
            <!-- https://vuejs.org/guide/components/slots.html#named-slots -->
            <slot name="text"></slot>
          </div>
          <slot v-else name="text"></slot>
        </div>
        <button
          v-show="isFocused"
          ref="resize"
          :class="
            'btn btn-primary rounded-circle fw-bold position-absolute translate-middle ' +
            (this.trueRotation > 135 && this.trueRotation < 315 && false
              ? 'top-0 start-0'
              : 'top-100 start-100')
          "
          style="padding: 2px 7.0075px; font-size: 1.25rem"
        >
          <font-awesome-icon
            icon="fa-solid fa-left-right"
            style="transform: rotate(45deg)"
          />
        </button>
        <button
          v-show="isFocused"
          ref="drag"
          class="btn btn-primary rounded-circle fw-bold position-absolute top-0 start-0 translate-middle"
          style="padding: 2px 7px; font-size: 1.25rem; touch-action: none"
        >
          <font-awesome-icon icon="fa-solid fa-up-down-left-right" />
        </button>
        <button
          v-show="isFocused"
          ref="delete"
          class="btn btn-danger rounded-circle fw-bold position-absolute top-0 start-100 translate-middle"
          style="padding: 2px 9.1405px; font-size: 1.25rem"
          @click="deleteSticker"
        >
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>
    </div>
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
      <div
        class="d-flex flex-column border-end border-secondary my-2 px-2"
        v-if="modelValue.border"
      >
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          >Border</label
        >
        <div class="d-flex">
          <div class="p-2">
            <label class="form-label text-nowrap">On/Off</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="modelValue.border.on"
                @click="
                  updateModelValue({
                    border: { ...modelValue.border, on: !modelValue.border.on },
                  })
                "
              />
            </div>
          </div>
          <div class="p-2" v-if="modelValue.border.on">
            <label class="form-label text-nowrap">Color</label>
            <input
              type="color"
              class="form-control form-control-color m-auto"
              :value="modelValue.border.color"
              @input="
                updateModelValue({
                  border: { ...modelValue.border, color: $event.target.value },
                })
              "
            />
          </div>
          <div class="p-2" v-if="modelValue.border.on">
            <label class="form-label text-nowrap">Style</label>
            <select
              class="form-select w-auto"
              :value="modelValue.border.style"
              @input="
                updateModelValue({
                  border: { ...modelValue.border, style: $event.target.value },
                })
              "
            >
              <option
                v-for="style in borderStyles"
                :key="style"
                :value="style.toLowerCase()"
              >
                {{ style }}
              </option>
            </select>
          </div>
          <div class="p-2" v-if="modelValue.border.on">
            <label class="form-label text-nowrap">Width</label>
            <input
              type="number"
              class="form-control form-control-small m-auto text-center"
              :value="modelValue.border.width"
              @input="
                updateModelValue({
                  border: {
                    ...modelValue.border,
                    width: parseFloat($event.target.value),
                  },
                })
              "
            />
          </div>
          <div class="p-2" v-if="modelValue.border.on">
            <label class="form-label text-nowrap">Inset</label>
            <input
              type="number"
              class="form-control form-control-small m-auto text-center"
              :value="modelValue.border.inset"
              @input="
                updateModelValue({
                  border: {
                    ...modelValue.border,
                    inset: parseFloat($event.target.value),
                  },
                })
              "
            />
          </div>
        </div>
      </div>
      <div
        class="d-flex flex-column border-end border-secondary my-2 px-2"
        v-if="modelValue.dimensions != null"
      >
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          >Dimensions</label
        >
        <div class="d-flex">
          <div
            class="p-2 border-end"
            v-if="modelValue.dimensions.width != null"
          >
            <label class="form-label text-nowrap">Width</label>
            <input
              type="number"
              class="form-control form-control-small m-auto text-center"
              :value="modelValue.dimensions.width"
              @input="
                updateModelValue({
                  dimensions: {
                    ...modelValue.dimensions,
                    width: parseFloat($event.target.value),
                  },
                })
              "
            />
          </div>
          <div
            class="p-2 border-end"
            v-if="modelValue.dimensions.height != null"
          >
            <label class="form-label text-nowrap">Height</label>
            <input
              type="number"
              class="form-control form-control-small m-auto text-center"
              :value="modelValue.dimensions.height"
              @input="
                updateModelValue({
                  dimensions: {
                    ...modelValue.dimensions,
                    height: parseFloat($event.target.value),
                  },
                })
              "
            />
          </div>
        </div>
      </div>
      <div
        class="d-flex flex-column border-end border-secondary my-2 px-2"
        v-if="modelValue.scale != null"
      >
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          >Scale</label
        >
        <div class="d-flex">
          <div
            class="p-2 border-end"
            v-if="modelValue.dimensions.width != null"
          >
            <input
              type="range"
              class="form-range"
              min="-2"
              max="2"
              step="1"
              :value="modelValue.scale"
              @input="
                updateModelValue({
                  scale: parseFloat($event.target.value),
                })
              "
            />
            <div class="d-block m-auto">
              <input
                type="number"
                class="form-control form-control-small text-center d-inline-block"
                :value="2 ** modelValue.scale * 100"
                @change="
                  updateModelValue({
                    scale: Math.log2(parseFloat($event.target.value) / 100),
                  })
                "
              />
              <label class="px-2">%</label>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column border-end border-secondary my-2 px-2">
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          v-if="modelValue.rotation != null"
          >Rotate</label
        >
        <div class="d-flex">
          <div class="p-2 border-end">
            <label class="form-label text-nowrap">Degrees</label>
            <input
              type="number"
              class="form-control form-control-small m-auto text-center"
              :value="modelValue.rotation"
              @input="
                updateModelValue({
                  rotation: parseFloat($event.target.value),
                })
              "
            />
          </div>
        </div>
      </div>
      <div class="d-flex flex-column border-end border-secondary my-2 px-2">
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          >Order</label
        >
        <button class="btn btn-outline-secondary" @click="moveToFront">
          <font-awesome-icon icon="fa-solid fa-angles-up" />
        </button>
        <button class="btn btn-outline-secondary" @click="moveUp">
          <font-awesome-icon icon="fa-solid fa-angle-up" />
        </button>
        <button class="btn btn-outline-secondary" @click="moveDown">
          <font-awesome-icon icon="fa-solid fa-angle-down" />
        </button>
        <button class="btn btn-outline-secondary" @click="moveToBack">
          <font-awesome-icon icon="fa-solid fa-angles-down" />
        </button>
      </div>
      <div class="d-flex flex-column border-end border-secondary my-2 px-2">
        <label
          class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
          v-if="modelValue.align != null"
          >Align</label
        >
        <div class="d-flex">
          <div class="p-2">
            <label class="form-label text-nowrap"></label>
            <button
              :class="`btn btn-outline-secondary d-block ${
                modelValue.align === 'start' ? 'active' : ''
              }`"
              @click="
                updateModelValue({
                  align: 'start',
                })
              "
            >
              <font-awesome-icon icon="fa-solid fa-align-left" />
            </button>
          </div>
          <div class="p-2">
            <label class="form-label text-nowrap"></label>
            <button
              :class="`btn btn-outline-secondary d-block ${
                modelValue.align === 'center' ? 'active' : ''
              }`"
              @click="
                updateModelValue({
                  align: 'center',
                })
              "
            >
              <font-awesome-icon icon="fa-solid fa-align-center" />
            </button>
          </div>
          <div class="p-2">
            <label class="form-label text-nowrap"></label>
            <button
              :class="`btn btn-outline-secondary d-block ${
                modelValue.align === 'end' ? 'active' : ''
              }`"
              @click="
                updateModelValue({
                  align: 'end',
                })
              "
            >
              <font-awesome-icon icon="fa-solid fa-align-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["id", "modelValue", "snapHeight"],
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
        "Atma",
        "Barrio",
        "Birthstone Bounce",
        "Bonbon",
        "Butterfly Kids",
        "Codystar",
        "Fredericka the Great",
        "Hachi Maru Pop",
        "Just Another Hand",
        "Londrina Outline",
        "Luckiest Guy",
        "Ms Madi",
        "Nanum Pen Script",
        "Oooh Baby",
        "Permanent Marker",
        "Ribeye Marrow",
        "Rochester",
        "Rock Salt",
        "Sacramento",
        "Send Flowers",
        "Shadows Into Light Two",
        "Special Elite",
        "Unkempt",
        "Waiting for the Sunrise",
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
  mounted() {
    $(window).resize(() => {
      this.updateOffset();
    });

    this.updateOffset();

    var dragging = false;
    var moving = false;
    var resizing = false;
    var rotateHandle = $(this.$refs.rotate);
    var dragHandle = $(this.$refs.drag);
    var resizeHandle = $(this.$refs.resize);
    var sticker = $(this.$refs.sticker);
    var startPos;
    var startShift;

    rotateHandle.on("mousedown touchstart", function () {
      dragging = true;
    });
    resizeHandle.on("mousedown touchstart", (e) => {
      resizing = true;

      startPos = {
        x: e.clientX,
        y: e.clientY,
      };

      if (
        e.type == "touchstart" ||
        e.type == "touchmove" ||
        e.type == "touchend" ||
        e.type == "touchcancel"
      ) {
        var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        startPos = {
          x: touch.pageX,
          y: touch.pageY,
        };
      }

      startShift = this.modelValue;
    });
    dragHandle.on("mousedown touchstart", (e) => {
      moving = true;
      startPos = {
        x: e.clientX,
        y: e.clientY,
      };

      if (
        e.type == "touchstart" ||
        e.type == "touchmove" ||
        e.type == "touchend" ||
        e.type == "touchcancel"
      ) {
        var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        startPos = {
          x: touch.pageX,
          y: touch.pageY,
        };
      }

      startShift = this.modelValue.position;
    });
    sticker.on("mousedown touchstart", (e) => {
      if (!resizing) {
        moving = true;
        startPos = {
          x: e.clientX,
          y: e.clientY,
        };

        if (
          e.type == "touchstart" ||
          e.type == "touchmove" ||
          e.type == "touchend" ||
          e.type == "touchcancel"
        ) {
          var evt =
            typeof e.originalEvent === "undefined" ? e : e.originalEvent;
          var touch = evt.touches[0] || evt.changedTouches[0];
          startPos = {
            x: touch.pageX,
            y: touch.pageY,
          };
        }

        startShift = this.modelValue.position;
      }
    });
    $(document).on("mouseup touchend", function () {
      dragging = false;
      moving = false;
      resizing = false;
    });
    $(document).on("mousemove touchmove", (e) => {
      var ePos = { x: e.clientX, y: e.clientY };
      if (
        e.type == "touchstart" ||
        e.type == "touchmove" ||
        e.type == "touchend" ||
        e.type == "touchcancel"
      ) {
        e.preventDefault();
        var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        ePos = {
          x: touch.pageX,
          y: touch.pageY,
        };
      }
      if (dragging) {
        // TODO: rotate handle
      } else if (moving) {
        var newX = startShift.left + ePos.x - startPos.x;
        var newY = startShift.top + ePos.y - startPos.y;

        var remX = Math.abs(newX % 174);
        if (remX < 10 || remX > 166) {
          newX = Math.round(newX / 174) * 174;
        }
        var remY = Math.abs(newY % this.snapHeight);
        if (remY < 10 || remY > this.snapHeight - 10) {
          newY = Math.round(newY / this.snapHeight) * this.snapHeight;
        }

        this.$emit("update:modelValue", {
          ...this.modelValue,
          position: { top: newY, left: newX },
        });
      } else if (resizing) {
        var newWidth =
          startShift.dimensions.width +
          (ePos.x * Math.cos(this.rotationRadians) +
            ePos.y * Math.sin(this.rotationRadians)) -
          (startPos.x * Math.cos(this.rotationRadians) +
            startPos.y * Math.sin(this.rotationRadians));
        var newHeight =
          startShift.dimensions.height -
          (ePos.x * Math.sin(this.rotationRadians) -
            ePos.y * Math.cos(this.rotationRadians)) +
          (startPos.x * Math.sin(this.rotationRadians) -
            startPos.y * Math.cos(this.rotationRadians));

        var remWidth = Math.abs(newWidth % 174);
        if (remWidth < 10 || remWidth > 164) {
          newWidth = Math.round(newWidth / 174) * 174;
        }
        var remHeight = Math.abs(newHeight % this.snapHeight);
        if (remHeight < 10 || remHeight > this.snapHeight - 10) {
          newHeight = Math.round(newHeight / this.snapHeight) * this.snapHeight;
        }

        if (this.modelValue.dimensions.ratio) {
          var ratioWidth = newHeight / this.modelValue.dimensions.ratio;
          var ratioHeight = newWidth * this.modelValue.dimensions.ratio;

          newWidth = Math.min(newWidth, ratioWidth);
          newHeight = Math.min(newHeight, ratioHeight);
        }

        let newDimensions = {
          width: Math.max(Math.round(newWidth), 5),
          height: Math.max(Math.round(newHeight), 5),
        };

        if (this.modelValue.dimensions.ratio) {
          newDimensions.ratio = this.modelValue.dimensions.ratio;
        }

        let newPosition = this.modelValue.position;

        const rotation = ((this.modelValue.rotation % 360) + 360) % 360;
        const rotationRad = ((rotation % 90) * Math.PI) / 180;
        const sinRotation = Math.sin(rotationRad);
        const cosRotation = Math.cos(rotationRad);
        if (rotation < 90) {
          newPosition = {
            top: this.modelValue.position.top,
            left:
              this.modelValue.position.left -
              sinRotation *
                (newDimensions.height - this.modelValue.dimensions.height),
          };
        } else if (rotation < 180) {
          newPosition = {
            top:
              this.modelValue.position.top -
              sinRotation *
                (newDimensions.height - this.modelValue.dimensions.height),
            left:
              this.modelValue.position.left -
              (sinRotation *
                (newDimensions.width - this.modelValue.dimensions.width) +
                cosRotation *
                  (newDimensions.height - this.modelValue.dimensions.height)),
          };
        } else if (rotation < 270) {
          newPosition = {
            top:
              this.modelValue.position.top -
              (sinRotation *
                (newDimensions.width - this.modelValue.dimensions.width) +
                cosRotation *
                  (newDimensions.height - this.modelValue.dimensions.height)),
            left:
              this.modelValue.position.left -
              cosRotation *
                (newDimensions.width - this.modelValue.dimensions.width),
          };
        } else {
          newPosition = {
            top:
              this.modelValue.position.top -
              cosRotation *
                (newDimensions.width - this.modelValue.dimensions.width),
            left: this.modelValue.position.left,
          };
        }

        this.$emit("update:modelValue", {
          ...this.modelValue,
          dimensions: newDimensions,
          position: newPosition,
        });
      }
    });

    $(document).on("mousedown touchstart", (e) => {
      if ($(sticker).parent().has(e.target).length == 0) {
        this.isFocused = false;
      }
    });
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

.sticker-border {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  top: 10px;
  left: 10px;
  border: 3px solid white;
}
</style>
