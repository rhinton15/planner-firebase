<template>
  <div class="h-100">
    <ul
      :style="{
        color: modelValue.font.color,
        fontFamily: modelValue.font.family,
        fontWeight: 400,
        fontSize: modelValue.font.size + 'px !important',
        resize: 'none',
        width: modelValue.dim.w + 'px',
        height: '100%',
      }"
      :colors="modelValue.colors"
      :class="`fa-ul position-absolute top-0 start-0 ${
        modelValue.font.bold ? 'fw-bold' : ''
      }`"
    >
      <li
        v-for="item in modelValue.items"
        :key="item"
        class="hidden"
        :style="`word-wrap: break-word; padding-left: ${
          parseFloat(modelValue.font.size) + 10
        }px`"
      >
        <span
          class="fa-li"
          :style="`width: ${modelValue.font.size}px; left: 5px`"
          @click.stop="toggleChecked(item)"
          ><font-awesome-icon
            :icon="`fa-regular fa-circle${item.done ? '-check' : ''}`"
        /></span>
        {{ item.text || "\xa0" }}
      </li>
    </ul>
    <textarea
      v-if="!screenShot"
      :style="{
        color: modelValue.font.color,
        fontFamily: modelValue.font.family,
        fontWeight: 400,
        fontSize: modelValue.font.size + 'px !important',
        resize: 'none',
        width: modelValue.dim.w - (parseFloat(modelValue.font.size) + 7) + 'px',
        height: '100%',
        paddingLeft: '3px',
        marginLeft: parseFloat(modelValue.font.size) + 7 + 'px',
      }"
      :colors="modelValue.colors"
      :class="`border-0 bg-transparent overflow-hidden position-absolute top-0 start-0 py-0 pe-0 ${
        modelValue.font.bold ? 'fw-bold' : ''
      }`"
      :value="todoString"
      @input="auto_grow($event.target)"
      @keydown="getCursor"
      ref="listInput"
    ></textarea>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["modelValue", "screenShot"],
  emit: ["update:modelValue"],
  data() {
    return { selectionStart: null, selectionEnd: null };
  },
  computed: {
    todoString() {
      return this.modelValue.items.map((item) => item.text).join("\n");
    },
  },
  methods: {
    click() {
      $(this.$refs.listInput).click();
      $(this.$refs.listInput).focus();
    },
    toggleChecked(item) {
      item.done = !item.done;
      this.updateModelValue({ items: this.modelValue.items });
    },
    getCursor() {
      let el = this.$refs.listInput;
      this.selectionStart = el.selectionStart;
      this.selectionEnd = el.selectionEnd;
    },
    getAllIndexes(arr, func) {
      var indexes = [],
        i = -1,
        startIndex = 0;
      while ((i = arr.findIndex(func)) != -1) {
        indexes.push(startIndex + i);
        startIndex += i + 1;
        arr = arr.slice(i + 1);
      }
      return indexes;
    },
    auto_grow(element) {
      element.style.height = "5px";
      var newSelectionStart = this.$refs.listInput.selectionStart;
      var startDelete = null;
      var endDelete = null;
      var startInsert = null;
      var endInsert = null;

      if (this.selectionStart === this.selectionEnd) {
        // can only be single deletion or single/multiple (paste) insertion
        if (newSelectionStart < this.selectionStart) {
          startDelete = newSelectionStart;
          endDelete = newSelectionStart;
        } else {
          startInsert = this.selectionStart;
          endInsert = newSelectionStart - 1;
        }
      } else {
        // can be multiple deletion or replace
        startDelete = this.selectionStart;
        endDelete = this.selectionEnd - 1;
        startInsert = this.selectionStart;
        endInsert = newSelectionStart - 1;
      }

      var checked = this.modelValue.items.map((item) => item.done);
      const newlineIndices = this.getAllIndexes(
        this.todoString.split(""),
        (char) => char === "\n"
      );
      const deletedNewlineIndices = this.getAllIndexes(
        newlineIndices,
        (index) => startDelete <= index && index <= endDelete
      );

      const newNewlineIndices = this.getAllIndexes(
        element.value.split(""),
        (char) => char === "\n"
      );
      const addedNewlineIndices = this.getAllIndexes(
        newNewlineIndices,
        (index) => startInsert <= index && index <= endInsert
      );
      deletedNewlineIndices.forEach((index) => checked.splice(index + 1, 1));
      addedNewlineIndices.forEach((index) =>
        checked.splice(index + 1, 0, false)
      );

      this.updateModelValue({
        items: element.value.split("\n").map((text, index) => {
          return { text, done: checked[index] || false };
        }),
        dim: {
          ...this.modelValue.dim,
          h: element.scrollHeight,
        },
      });
      element.style.height = "100%";
    },
    updateModelValue(newValues) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        ...newValues,
      });
    },
  },
};
</script>
