<template>
  <div
    class="settings d-flex overflow-auto"
    style="z-index: 1000"
    @click="(e) => e.stopPropagation()"
  >
    <div class="d-flex flex-column border-end border-secondary my-2 px-2">
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Month Label</label
      >
      <div class="d-flex">
        <div class="p-2">
          <label class="form-label text-nowrap">Color</label>
          <input
            type="color"
            class="form-control form-control-color m-auto"
            :value="modelValue.m.col || '#000000'"
            @input="stringInput($event, 'm', 'col', '#000000')"
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Font</label>
          <select
            class="form-select w-auto"
            :value="modelValue.m.fam || 'Montserrat'"
            @input="stringInput($event, 'm', 'fam', 'Montserrat')"
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
            :value="modelValue.m.size || 40"
            @input="numberInput($event, 'm', 'size', 40, 0, 1, 1000)"
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Bold</label>
          <button
            :class="`btn btn-outline-secondary d-block ${
              modelValue.m.b ? 'active' : ''
            }`"
            @click="boolInput('m', 'b', true)"
          >
            <font-awesome-icon icon="fa-solid fa-bold" />
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column border-end border-secondary my-2 px-2">
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Day Label</label
      >
      <div class="d-flex">
        <div class="p-2">
          <label class="form-label text-nowrap">Color</label>
          <input
            type="color"
            class="form-control form-control-color m-auto"
            :value="modelValue.d.col || '#000000'"
            @input="stringInput($event, 'd', 'col', '#000000')"
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Font</label>
          <select
            class="form-select w-auto"
            :value="modelValue.d.fam || 'Amatic SC'"
            @input="stringInput($event, 'm', 'fam', 'Amatic SC')"
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
            :value="modelValue.d.size || 40"
            @input="numberInput($event, 'd', 'size', 40, 0, 1, 1000)"
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Bold</label>
          <button
            :class="`btn btn-outline-secondary d-block ${
              modelValue.d.b ? 'active' : ''
            }`"
            @click="boolInput('d', 'b', true)"
          >
            <font-awesome-icon icon="fa-solid fa-bold" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="backdrop" @click="removeFocus"></div>
</template>

<script>
import { debounce } from "lodash";

export default {
  props: ["modelValue"],
  emits: ["update:modelValue", "removeFocus"],
  data() {
    return {
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
        "Montserrat",
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
    };
  },
  methods: {
    updateModelValue(newValues) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        ...newValues,
      });
    },
    removeFocus() {
      this.$emit("removeFocus");
    },
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
        !event.target.value.endsWith(".") &&
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
