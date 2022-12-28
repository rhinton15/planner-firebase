<template>
  <div
    class="settings d-flex overflow-auto"
    v-if="id != null"
    style="z-index: 1000; font-size: 14px"
    ref="settings"
  >
    <sticker-property-group title="Actions">
      <sticker-property>
        <sticker-property-button
          title="duplicate"
          icon="fa-solid fa-copy"
          @click="duplicate"
        ></sticker-property-button>
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Fill">
      <sticker-property
        v-for="index in colors.length"
        :key="index"
        :title="`Color ${index}`"
      >
        <input
          type="color"
          :id="'color' + index"
          class="form-control form-control-color m-auto"
          :name="'color' + index"
          v-model="colors[index - 1]"
          @change="updateModelValue({ colors: colors })"
        />
      </sticker-property>
      <sticker-property title="Transparency">
        <input
          type="number"
          step="1"
          class="form-control form-control-small m-auto text-center d-inline-block"
          :value="Math.round((1 - (modelValue.op || 1)) * 100)"
          @input="
            numberInput($event, null, 'op', 1, 2, 0, 1, (x) => 1 - x / 100)
          "
        />
        <label class="px-2">%</label>
      </sticker-property>
      <sticker-property title="Rotate" v-if="modelValue.type">
        <input
          type="number"
          class="form-control form-control-small m-auto text-center"
          :value="modelValue.prot || 0"
          @input="numberInput($event, null, 'prot', 0, 0, -1000, 1000)"
        />
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Font" v-if="modelValue.font != null">
      <sticker-property title="Color">
        <input
          type="color"
          class="form-control form-control-color m-auto"
          :value="modelValue.font.col || '#000000'"
          @input="stringInput($event, 'font', 'col', '#000000')"
        />
      </sticker-property>
      <sticker-property title="Font">
        <select
          class="form-select w-auto"
          :value="modelValue.font.fam"
          @input="stringInput($event, 'font', 'fam', null)"
        >
          <option v-for="font in fonts.sort()" :key="font" :value="font">
            {{ font }}
          </option>
        </select>
      </sticker-property>
      <sticker-property title="Size">
        <input
          type="number"
          class="form-control form-control-small m-auto text-center"
          :value="modelValue.font.size"
          @input="numberInput($event, 'font', 'size', null, 0, 1, 1000)"
        />
      </sticker-property>
      <sticker-property title="Bold">
        <sticker-property-button
          title="bold"
          icon="fa-solid fa-bold"
          :class="`d-block ${modelValue.font.b ? 'active' : ''}`"
          @click="boolInput('font', 'b', true)"
        ></sticker-property-button>
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Border">
      <sticker-property title="On/Off">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="modelValue.bord || false"
            @input="boolInput(null, 'bord', {})"
          />
        </div>
      </sticker-property>
      <sticker-property title="Color" v-if="modelValue.bord">
        <input
          type="color"
          class="form-control form-control-color m-auto"
          :value="modelValue.bord.col || '#ffffff'"
          @input="stringInput($event, 'bord', 'col', '#ffffff')"
        />
      </sticker-property>
      <sticker-property title="Style" v-if="modelValue.bord">
        <select
          class="form-select w-auto"
          :value="modelValue.bord.sty || 'solid'"
          @input="stringInput($event, 'bord', 'sty', 'solid')"
        >
          <option
            v-for="style in borderStyles"
            :key="style"
            :value="style.toLowerCase()"
          >
            {{ style }}
          </option>
        </select>
      </sticker-property>
      <sticker-property title="Width" v-if="modelValue.bord">
        <input
          type="number"
          class="form-control form-control-small m-auto text-center"
          :value="modelValue.bord.w || 5"
          @input="numberInput($event, 'bord', 'w', 5, 0, 0, 100)"
        />
      </sticker-property>
      <sticker-property title="Inset" v-if="modelValue.bord">
        <input
          type="number"
          class="form-control form-control-small m-auto text-center"
          :value="modelValue.bord.in || 5"
          @input="numberInput($event, 'bord', 'in', 5, 0, 0, 100)"
        />
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Dimensions" v-if="modelValue.dim != null">
      <sticker-property title="Width" v-if="modelValue.dim.w != null">
        <input
          type="number"
          step="0.5"
          class="form-control form-control-small m-auto text-center"
          :value="(Math.round((modelValue.dim.w / 58) * 100) / 100).toString()"
          @input="
            numberInput($event, 'dim', 'w', null, 2, 5, 10000, (x) => x * 58)
          "
        />
      </sticker-property>
      <sticker-property title="Height" v-if="modelValue.dim.h != null">
        <input
          type="number"
          step="0.5"
          class="form-control form-control-small m-auto text-center"
          :value="(Math.round((modelValue.dim.h / 58) * 100) / 100).toString()"
          @input="
            numberInput($event, 'dim', 'h', null, 2, 5, 10000, (x) => x * 58)
          "
        />
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Scale" v-if="modelValue.type">
      <div class="p-2 border-end">
        <input
          type="range"
          class="form-range"
          min="-2"
          max="2"
          step="1"
          :value="modelValue.scale || 0"
          @input="numberInput($event, null, 'scale', 0, 3, -10, 10)"
        />
        <div class="d-block m-auto text-nowrap">
          <input
            type="number"
            class="form-control form-control-small text-center d-inline-block"
            :value="Math.round(2 ** (modelValue.scale || 0) * 100)"
            @change="
              numberInput($event, null, 'scale', 0, 3, -10, 10, (x) =>
                Math.log2(parseFloat(x) / 100)
              )
            "
          />
          <label class="px-2">%</label>
        </div>
      </div>
    </sticker-property-group>
    <sticker-property-group title="Rotate">
      <sticker-property title="Degrees">
        <input
          type="number"
          class="form-control form-control-small m-auto text-center"
          :value="modelValue.rot || 0"
          @input="numberInput($event, null, 'rot', 0, 0, -1000, 1000)"
        />
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Order">
      <sticker-property>
        <sticker-property-button
          title="move to front"
          icon="fa-solid fa-angles-up"
          @click="moveToFront"
        ></sticker-property-button>
      </sticker-property>
      <sticker-property>
        <sticker-property-button
          title="move up"
          icon="fa-solid fa-angle-up"
          @click="moveUp"
        ></sticker-property-button>
      </sticker-property>
      <sticker-property>
        <sticker-property-button
          title="move down"
          icon="fa-solid fa-angle-down"
          @click="moveDown"
        ></sticker-property-button>
      </sticker-property>
      <sticker-property>
        <sticker-property-button
          title="move to back"
          icon="fa-solid fa-angles-down"
          @click="moveToBack"
        ></sticker-property-button>
      </sticker-property>
    </sticker-property-group>
    <sticker-property-group title="Align" v-if="modelValue.text != null">
      <sticker-property>
        <sticker-property-button
          title="align left"
          icon="fa-solid fa-align-left"
          :class="`${modelValue.align === 'start' ? 'active' : ''}`"
          @click="
            updateModelValue({
              align: 'start',
            })
          "
        ></sticker-property-button>
      </sticker-property>
      <sticker-property>
        <sticker-property-button
          title="align center"
          icon="fa-solid fa-align-center"
          :class="`${modelValue.align === 'center' ? 'active' : ''}`"
          @click="
            updateModelValue({
              align: 'center',
            })
          "
        ></sticker-property-button>
      </sticker-property>
      <sticker-property>
        <sticker-property-button
          title="align right"
          icon="fa-solid fa-align-right"
          :class="`${modelValue.align === 'end' ? 'active' : ''}`"
          @click="
            updateModelValue({
              align: 'end',
            })
          "
        ></sticker-property-button>
      </sticker-property>
    </sticker-property-group>
  </div>
</template>

<script>
import $ from "jquery";
import { debounce } from "lodash";
import StickerProperty from "./StickerProperty.vue";
import StickerPropertyButton from "./StickerPropertyButton.vue";
import StickerPropertyGroup from "./StickerPropertyGroup.vue";

export default {
  components: { StickerProperty, StickerPropertyButton, StickerPropertyGroup },
  props: ["id", "modelValue"],
  emits: [
    "update:modelValue",
    "moveToFront",
    "moveUp",
    "moveDown",
    "moveToBack",
    "duplicate",
    "test",
  ],
  data() {
    return {
      colors: [],
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
  methods: {
    numberInput: debounce(function (
      event,
      parentField,
      field,
      defaultVal,
      decimals = 2,
      min = 0,
      max = 1,
      transform = (x) => x
    ) {
      if (
        !event.target.value.match(/\.0*$/) &&
        event.target.value != "" &&
        event.target.value != "-0"
      ) {
        let newValue = (
          Math.round(
            Math.max(
              Math.min(transform(parseFloat(event.target.value)), max),
              min
            ) * Math.pow(10, decimals)
          ) / Math.pow(10, decimals)
        ).toString();

        let newValues = {
          ...this.modelValue,
        };

        if (parentField != null) {
          if (newValue != defaultVal?.toString()) {
            newValues[parentField][field] = newValue;
          } else {
            delete newValues[parentField][field];
          }
        } else {
          if (newValue != defaultVal?.toString()) {
            newValues[field] = newValue;
          } else {
            delete newValues[field];
          }
        }

        this.$emit("update:modelValue", {
          ...newValues,
        });
      }
    }),
    boolInput: debounce(function (parentField, field, activeValue) {
      let newValues = {
        ...this.modelValue,
      };

      if (parentField != null) {
        if (!newValues[parentField][field]) {
          newValues[parentField][field] = activeValue;
        } else {
          delete newValues[parentField][field];
        }
      } else {
        if (!newValues[field]) {
          newValues[field] = activeValue;
        } else {
          delete newValues[field];
        }
      }

      this.$emit("update:modelValue", {
        ...newValues,
      });
    }),
    stringInput: debounce(function (
      event,
      parentField,
      field,
      defaultVal = ""
    ) {
      let newValue = event.target.value;

      let newValues = {
        ...this.modelValue,
      };

      if (parentField != null) {
        if (newValue != defaultVal?.toString()) {
          newValues[parentField][field] = newValue;
        } else {
          delete newValues[parentField][field];
        }
      } else {
        if (newValue != defaultVal?.toString()) {
          newValues[field] = newValue;
        } else {
          delete newValues[field];
        }
      }

      this.$emit("update:modelValue", {
        ...newValues,
      });
    }),
    updateModelValue: debounce(function (newValues) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        ...newValues,
      });
    }, 100),
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
  },
  watch: {
    modelValue() {
      this.colors = this.modelValue.colors || [];
    },
  },
  mounted() {
    this.colors = this.modelValue.colors || [];
    $(this.$refs.settings).on("mousedown touchstart", (e) => {
      e.stopPropagation();
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
</style>
