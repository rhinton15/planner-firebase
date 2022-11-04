<template>
  <div style="margin-bottom: 10rem" v-for="week in 4" :key="week">
    <div class="d-inline-flex">
      <!-- <label
      style="font-family: 'Amatic SC', cursive; font-weight: 700"
      class="w-100 text-center fs-1"
      >{{ date }}</label
    > -->
      <planner-cell
        v-for="day in 7"
        :key="day"
        :date="date"
        :col="day"
        :row="week"
        :disabled="disabled"
        width="174"
        height="174"
        @addText="addText"
        @addToDo="addToDo"
        @addSticker="addSticker"
      ></planner-cell>
    </div>
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
