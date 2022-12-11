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
          @showModal="showModal"
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
  emits: ["showModal"],
  methods: {
    showModal(props) {
      this.$emit("showModal", props);
    },
  },
  computed: {
    dates() {
      return this.calendarDates(this.year, this.month);
    },
  },
};
</script>
