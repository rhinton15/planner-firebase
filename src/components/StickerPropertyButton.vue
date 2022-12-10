<template>
  <button class="btn btn-outline-secondary" :title="title" @click="click">
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script>
export default {
  props: ["icon", "title"],
  emits: ["click"],
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>
