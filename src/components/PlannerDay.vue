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
  </div>
</template>

<script>
import PlannerCell from "./PlannerCell.vue";

export default {
  components: { PlannerCell },
  props: ["date", "index", "disabled"],
  emits: ["showModal"],
  methods: {
    showModal(props) {
      this.$emit("showModal", props);
    },
  },
};
</script>
