<template>
  <div class="d-flex flex-column border-end border-secondary my-2 px-2">
    <label
      class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
      >{{ title }}</label
    >
    <div class="d-flex">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>
