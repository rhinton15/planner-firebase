<template>
  <div class="d-flex flex-column" style="margin-bottom: 10rem">
    <label
      style="font-family: 'Amatic SC', cursive; font-weight: 700"
      class="w-100 text-center fs-1"
      >{{ date }}</label
    >
    <planner-cell
      v-for="cell in 3"
      :key="cell"
      :date="date"
      :col="index"
      :row="cell"
      :disabled="disabled"
      :width="174"
      :height="290"
      @addText="addText"
      @addToDo="addToDo"
      @addSticker="addSticker"
    ></planner-cell>
  </div>
</template>

<script>
import PlannerCell from "./PlannerCell.vue";

export default {
  components: { PlannerCell },
  props: ["date", "index", "disabled"],
  emits: ["addText", "addToDo", "addSticker"],
  methods: {
    addText(position) {
      this.$emit("addText", position);
    },
    addToDo(position) {
      this.$emit("addToDo", position);
    },
    addSticker(position) {
      this.$emit("addSticker", position);
    },
  },
};
</script>
