<template>
  <div>
    <!-- https://thewebdev.info/2021/05/19/how-to-prevent-the-click-event-from-propagating-to-the-parent-when-clicking-a-button-inside-an-element-with-vue-js/#:~:text=We%20can%20prevent%20the%20click,js%20with%20the%20self%20modifier.&text=We%20add%20the%20self%20modifier,confined%20to%20the%20parent%20div -->
    <div
      :class="
        'border border-dark position-relative ' +
        (isHovering || disabled ? 'hover' : '')
      "
      :id="col + '-' + row"
      :style="`width: ${width}px; height: ${height}px; border-top-width: ${1}px !important`"
      @click.self="showModal"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <div
        :class="
          'position-absolute top-0 end-0 p-1' +
          (isHovering || disabled ? '' : ' bg-white')
        "
        style="z-index: 9; width: 32px; height: 32px"
        @click.self="showModal"
        v-if="text"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["date", "row", "col", "disabled", "width", "height", "text"],
  emits: ["showModal"],
  data() {
    return {
      isModalOpen: false,
      isHovering: false,
      texts: [],
      dots: 0,
      offsetTop: 0,
      offsetLeft: 0,
    };
  },
  methods: {
    showModal() {
      this.$emit("showModal", {
        pos: { y: this.offsetTop, x: this.offsetLeft },
        dim: {
          w: this.width,
          h: this.height,
        },
      });
    },
  },
  mounted() {
    var cell1 = document.getElementById("1-1");
    this.offsetTop = this.$el.offsetTop - cell1.offsetTop;
    this.offsetLeft = this.$el.offsetLeft - cell1.offsetLeft;
  },
};
</script>

<style scoped>
.hover {
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
