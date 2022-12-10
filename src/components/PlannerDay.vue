<template>
  <div class="d-flex flex-column">
    <planner-cell
      v-for="cell in 3"
      :key="cell"
      :date="date"
      :col="index"
      :row="cell"
      :disabled="disabled"
      :width="174"
      :height="290"
      @showModal="showModal"
    ></planner-cell>
    <!-- @addText="addText"
      @addToDo="addToDo"
      @addSticker="addSticker" -->
  </div>
</template>

<script>
import PlannerCell from "./PlannerCell.vue";

export default {
  components: { PlannerCell },
  props: ["date", "index", "disabled"],
  // emits: ["addText", "addToDo", "addSticker"],
  emits: ["showModal"],
  methods: {
    // addText(position) {
    //   this.$emit("addText", position);
    // },
    // addToDo(position) {
    //   this.$emit("addToDo", position);
    // },
    // addSticker(position) {
    //   this.$emit("addSticker", position);
    // },
    showModal(position) {
      this.$emit("showModal", position);
    },
  },
};
</script>
