<template>
  <div class="p-2">
    <label class="form-label text-nowrap">{{ title }}</label>
    <!-- https://stackoverflow.com/questions/47311936/v-model-and-child-components -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>
