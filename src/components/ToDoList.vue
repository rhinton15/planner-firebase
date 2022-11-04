<template>
  <div class="h-100">
    <ul
      :style="{
        color: modelValue.font.color,
        fontFamily: modelValue.font.family,
        fontWeight: 400,
        fontSize: modelValue.font.size + 'px !important',
        resize: 'none',
        width: modelValue.dimensions.width + 'px',
        height: '100%',
      }"
      :colors="modelValue.colors"
      :class="`position-absolute top-0 start-0 ${
        modelValue.font.bold ? 'fw-bold' : ''
      }`"
    >
      <li
        v-for="item in modelValue.text.split('\n')"
        :key="item"
        class="hidden"
      >
        {{ item }}
      </li>
    </ul>
    <textarea
      :style="{
        color: modelValue.font.color,
        fontFamily: modelValue.font.family,
        fontWeight: 400,
        fontSize: modelValue.font.size + 'px !important',
        resize: 'none',
        width: modelValue.dimensions.width + 'px',
        height: '100%',
        paddingLeft: '32px',
      }"
      :colors="modelValue.colors"
      :class="`border-0 bg-transparent overflow-hidden position-absolute top-0 start-0 py-0 pe-0 ${
        modelValue.font.bold ? 'fw-bold' : ''
      }`"
      :value="modelValue.text"
      @input="auto_grow($event.target)"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emit: ["update:modelValue"],
  methods: {
    auto_grow(element) {
      element.style.height = "5px";
      //   this.updateModelValue({
      //       dimensions: {
      //           ...this.modelValue.dimensions,
      //       height: element.scrollHeight,
      //     },
      //   });
      this.updateModelValue({
        text: element.value,
        dimensions: {
          ...this.modelValue.dimensions,
          height: element.scrollHeight,
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
