<template>
  <textarea
    :style="{
      color: modelValue.font.col,
      fontFamily: modelValue.font.fam,
      fontWeight: 400,
      fontSize: modelValue.font.size + 'px !important',
      resize: 'none',
      width:
        modelValue.dim.w -
        2 * (modelValue.bord.w + modelValue.bord.in) * (modelValue.bord || 0) +
        'px',
      height: '100%',
    }"
    :colors="modelValue.colors"
    :class="`text-${
      modelValue.align
    } fs-1 border-0 bg-transparent textwhite overflow-hidden ${
      modelValue.font.b ? 'fw-bold' : ''
    }`"
    v-model="modelValue.text"
    @input="auto_grow($event.target, sticker)"
  ></textarea>
</template>

<script>
export default {
  props: ["modelValue"],
  emit: ["update:modelValue"],
  mounted() {
    console.log(
      this.modelValue.dim.w -
        2 *
          (this.modelValue.bord.w + this.modelValue.bord.in) *
          (this.modelValue.bord ? 1 : 0) +
        "px"
    );
  },
};
</script>
