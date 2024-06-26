<template>
  <div ref="page">
    <div
      ref="sticker"
      :class="
        'position-absolute ' +
        (this.isFocused && false ? 'border border-rounded' : '')
      "
      :style="
        'top: ' +
        (this.modelValue.pos.y + this.offset.top) +
        'px; left: ' +
        (this.modelValue.pos.x + this.offset.left) +
        'px; ' +
        (this.isFocused ? ' z-index: 100;' : '') +
        'width: ' +
        boundingBox.dimensions.width +
        'px; height: ' +
        boundingBox.dimensions.height +
        'px; pointer-events: none; '
      "
      v-if="visible"
      @mousedown="focusSticker"
      @touchdown="focusSticker"
      @click="focusSticker"
    >
      <div
        class="position-absolute"
        :style="
          'pointer-events: auto; transform: rotate(' +
          (this.modelValue.rot || 0) +
          'deg); margin-top: ' +
          boundingBox.margins.top +
          'px; margin-left: ' +
          boundingBox.margins.left +
          'px;'
        "
      >
        <div
          :style="
            (this.isFocused
              ? `opacity: ${75 * (modelValue.op || 1)}%;`
              : `opacity: ${modelValue.op || 1};`) +
            'width: ' +
            this.modelValue.dim.w +
            'px; height: ' +
            this.modelValue.dim.h +
            'px;'
          "
        >
          <slot></slot>
          <div
            v-if="modelValue.bord"
            class="position-absolute sticker-border"
            v-on:click.self.prevent
            :style="`width: calc(100% - ${2 * (modelValue.bord.in || 5)}px);
              height: calc(100% - ${2 * (modelValue.bord.in || 5)}px);
              top: ${modelValue.bord.in || 5}px;
              left: ${modelValue.bord.in || 5}px;
              border: ${modelValue.bord.w || 5}px ${
              modelValue.bord.sty || 'solid'
            } ${modelValue.bord.col || '#FFFFFF'};`"
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
    <div v-if="isFocused" class="backdrop" @click="removeFocus"></div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["id", "modelValue", "snapHeight", "offset"],
  emits: ["update:modelValue", "update:focus", "delete"],
  data() {
    return {
      visible: true,
      rotation: 0,
      isFocused: false,
      colors: [],
    };
  },
  computed: {
    trueRotation() {
      return ((parseInt(this.modelValue.rot || 0) % 360) + 360) % 360;
    },
    rotationRadians() {
      return (parseInt(this.modelValue.rot || 0) / 180) * Math.PI;
    },
    ratio() {
      let h = this.modelValue.dim.h;
      let w = this.modelValue.dim.w;
      let H = this.boundingBox.dimensions.height;
      let W = this.boundingBox.dimensions.width;
      let x = W - ((h / w) * (H - (h / w) * W)) / (1 - (h / w) ** 2);
      let y = (H - (h / w) * W) / (1 - (h / w) ** 2);
      return x / y;
    },
    boundingBox() {
      return this.calculateBoundingBox(this.modelValue.dim);
    },
  },
  watch: {
    isFocused(newValue) {
      this.$emit("update:focus", newValue);
    },
  },
  methods: {
    click() {
      $(document).trigger("mousedown");
      this.$refs.sticker.click();
    },
    focusSticker(e) {
      if (!this.isFocused) {
        this.isFocused = true;
        e.preventDefault();
      }
    },
    deleteSticker() {
      this.isFocused = false;
      this.$emit("delete", this.id);
    },
    calculateBoundingBox(dim) {
      let diameter = Math.sqrt(dim.h ** 2 + dim.w ** 2);
      let angle = (Math.atan(dim.w / dim.h) * 180) / Math.PI;

      // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
      const rotationAngle =
        ((parseInt(this.modelValue.rot || 0) + 90) % 180) - 90;

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
        top: (dimensions.height - dim.h) / 2,
        left: (dimensions.width - dim.w) / 2,
      };

      return { dimensions, margins };
    },
    removeFocus() {
      this.isFocused = false;
    },
    calculatePosition(newX, newY) {
      newX = Math.round(
        Math.min(
          Math.max(newX, this.offset.left * -1),
          174 * 7 + this.offset.left - this.boundingBox.dimensions.width
        )
      );

      // TODO: revisit this when adding feature to add rows
      newY = Math.round(
        Math.min(
          Math.max(newY, this.offset.top * -1),
          290 * 3 - this.boundingBox.dimensions.height
        )
      );

      return { x: newX, y: newY };
    },
  },
  mounted() {
    var dragging = false;
    var moving = false;
    var resizing = false;
    var rotateHandle = $(this.$refs.rotate);
    var resizeHandle = $(this.$refs.resize);
    var sticker = $(this.$refs.sticker);
    var startPos;
    var startShift;
    var element = document.getElementById("pinch-zoom");
    var scale = 1;

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
    sticker.on("mousedown touchstart", (e) => {
      scale = element.getBoundingClientRect().width / element.offsetWidth;

      if (!resizing && this.isFocused) {
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

        startShift = this.modelValue.pos;
      }
    });
    $(document).on("mouseup touchend", function () {
      dragging = false;
      moving = false;
      resizing = false;
    });
    $(this.$refs.page).on("mousemove touchmove", (e) => {
      if (!this.isFocused) {
        return;
      }
      e.stopPropagation();

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
        var newX = startShift.x + (ePos.x - startPos.x) / scale;
        var newY = startShift.y + (ePos.y - startPos.y) / scale;

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
          pos: this.calculatePosition(newX, newY),
        });
      } else if (resizing) {
        var newWidth =
          startShift.dim.w * 1 +
          ((ePos.x / scale) * Math.cos(this.rotationRadians) +
            (ePos.y / scale) * Math.sin(this.rotationRadians)) -
          ((startPos.x / scale) * Math.cos(this.rotationRadians) +
            (startPos.y / scale) * Math.sin(this.rotationRadians));
        var newHeight =
          startShift.dim.h * 1 -
          ((ePos.x / scale) * Math.sin(this.rotationRadians) -
            (ePos.y / scale) * Math.cos(this.rotationRadians)) +
          ((startPos.x / scale) * Math.sin(this.rotationRadians) -
            (startPos.y / scale) * Math.cos(this.rotationRadians));

        var remWidth = Math.abs(newWidth % 174);
        if (remWidth < 10 || remWidth > 164) {
          newWidth = Math.round(newWidth / 174) * 174;
        }
        var remHeight = Math.abs(newHeight % this.snapHeight);
        if (remHeight < 10 || remHeight > this.snapHeight - 10) {
          newHeight = Math.round(newHeight / this.snapHeight) * this.snapHeight;
        }

        if (this.modelValue.dim.r) {
          var ratioWidth = newHeight / this.modelValue.dim.r;
          var ratioHeight = newWidth * this.modelValue.dim.r;

          newWidth = Math.min(newWidth, ratioWidth);
          newHeight = Math.min(newHeight, ratioHeight);
        }

        let newDimensions = {
          ...this.modelValue.dim,
          w: Math.max(Math.round(newWidth), 5).toString(),
          h: Math.max(Math.round(newHeight), 5).toString(),
        };

        let newPosition = this.modelValue.pos;

        const rotation =
          ((parseInt(this.modelValue.rot || 0) % 360) + 360) % 360;
        const rotationRad = ((rotation % 90) * Math.PI) / 180;
        const sinRotation = Math.sin(rotationRad);
        const cosRotation = Math.cos(rotationRad);
        if (rotation < 90) {
          newPosition = {
            y: this.modelValue.pos.y,
            x:
              this.modelValue.pos.x -
              sinRotation * (newDimensions.h - this.modelValue.dim.h),
          };
        } else if (rotation < 180) {
          newPosition = {
            y:
              this.modelValue.pos.y -
              sinRotation * (newDimensions.h - this.modelValue.dim.h),
            x:
              this.modelValue.pos.x -
              (sinRotation * (newDimensions.w - this.modelValue.dim.w) +
                cosRotation * (newDimensions.h - this.modelValue.dim.h)),
          };
        } else if (rotation < 270) {
          newPosition = {
            y:
              this.modelValue.pos.y -
              (sinRotation * (newDimensions.w - this.modelValue.dim.w) +
                cosRotation * (newDimensions.h - this.modelValue.dim.h)),
            x:
              this.modelValue.pos.x -
              cosRotation * (newDimensions.w - this.modelValue.dim.w),
          };
        } else {
          newPosition = {
            y:
              this.modelValue.pos.y -
              cosRotation * (newDimensions.w - this.modelValue.dim.w),
            x: this.modelValue.pos.x,
          };
        }

        this.$emit("update:modelValue", {
          ...this.modelValue,
          dim: newDimensions,
          pos: this.calculatePosition(newPosition.x, newPosition.y),
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

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0);
}
</style>
