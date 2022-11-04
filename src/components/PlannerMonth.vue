<template>
  <div class="d-flex flex-column" style="margin-bottom: 10rem">
    <div class="d-flex" v-for="week in dates.length / 7" :key="week">
      <div class="d-inline-flex">
        <planner-cell
          v-for="day in 7"
          :key="day"
          :col="day"
          :row="week"
          :disabled="disabled"
          :width="width"
          :height="height"
          :text="
            (week == 1 && dates[(week - 1) * 7 + day - 1] > 7) ||
            (week == dates.length / 7 && dates[(week - 1) * 7 + day - 1] < 8)
              ? ''
              : dates[(week - 1) * 7 + day - 1]
          "
          @addText="addText"
          @addToDo="addToDo"
          @addSticker="addSticker"
        ></planner-cell>
      </div>
    </div>
  </div>
</template>

<script>
import calendarMixin from "../mixins/calendarMixin";
import PlannerCell from "../components/PlannerCell.vue";

export default {
  components: { PlannerCell },
  mixins: [calendarMixin],
  props: ["disabled", "width", "height", "year", "month"],
  emits: ["addText", "addToDo", "addSticker"],
  methods: {
    addText(props) {
      this.$emit("addText", props);
    },
    addToDo(props) {
      this.$emit("addToDo", props);
    },
    addSticker(props) {
      this.$emit("addSticker", props);
    },
  },
  computed: {
    dates() {
      return this.calendarDates(this.year, this.month);
    },
  },
};
</script>
