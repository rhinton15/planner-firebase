<template>
  <div class="settings d-flex" style="z-index: 1000">
    <div class="d-flex flex-column border-end border-secondary my-2 px-2">
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Month Label</label
      >
      <div class="d-flex">
        <div class="p-2">
          <label class="form-label text-nowrap">Color</label>
          <input
            type="color"
            class="form-control form-control-color m-auto"
            :value="modelValue.month.color"
            @input="
              updateModelValue({
                month: { ...modelValue.month, color: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Font</label>
          <select
            class="form-select w-auto"
            :value="modelValue.month.family"
            @input="
              updateModelValue({
                month: { ...modelValue.month, family: $event.target.value },
              })
            "
          >
            <option v-for="font in fonts.sort()" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Size</label>
          <input
            type="number"
            class="form-control form-control-small m-auto text-center"
            :value="modelValue.month.size"
            @input="
              updateModelValue({
                month: { ...modelValue.month, size: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Bold</label>
          <button
            :class="`btn btn-outline-secondary d-block ${
              modelValue.month.bold ? 'active' : ''
            }`"
            @click="
              updateModelValue({
                month: { ...modelValue.month, bold: !modelValue.month.bold },
              })
            "
          >
            <font-awesome-icon icon="fa-solid fa-bold" />
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column border-end border-secondary my-2 px-2">
      <label
        class="form-label text-nowrap m-0 border-bottom border-secondary px-2"
        >Day Label</label
      >
      <div class="d-flex">
        <div class="p-2">
          <label class="form-label text-nowrap">Color</label>
          <input
            type="color"
            class="form-control form-control-color m-auto"
            :value="modelValue.day.color"
            @input="
              updateModelValue({
                day: { ...modelValue.day, color: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Font</label>
          <select
            class="form-select w-auto"
            :value="modelValue.day.family"
            @input="
              updateModelValue({
                day: { ...modelValue.day, family: $event.target.value },
              })
            "
          >
            <option v-for="font in fonts.sort()" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Size</label>
          <input
            type="number"
            class="form-control form-control-small m-auto text-center"
            :value="modelValue.day.size"
            @input="
              updateModelValue({
                day: { ...modelValue.day, size: $event.target.value },
              })
            "
          />
        </div>
        <div class="p-2">
          <label class="form-label text-nowrap">Bold</label>
          <button
            :class="`btn btn-outline-secondary d-block ${
              modelValue.day.bold ? 'active' : ''
            }`"
            @click="
              updateModelValue({
                day: { ...modelValue.day, bold: !modelValue.day.bold },
              })
            "
          >
            <font-awesome-icon icon="fa-solid fa-bold" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      fonts: [
        "Amatic SC",
        "Atma",
        "Barrio",
        "Birthstone Bounce",
        "Bonbon",
        "Butterfly Kids",
        "Codystar",
        "Fredericka the Great",
        "Hachi Maru Pop",
        "Just Another Hand",
        "Londrina Outline",
        "Luckiest Guy",
        "Montserrat",
        "Ms Madi",
        "Nanum Pen Script",
        "Oooh Baby",
        "Permanent Marker",
        "Ribeye Marrow",
        "Rochester",
        "Rock Salt",
        "Sacramento",
        "Send Flowers",
        "Shadows Into Light Two",
        "Special Elite",
        "Unkempt",
        "Waiting for the Sunrise",
      ],
    };
  },
  methods: {
    updateModelValue(newValues) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        ...newValues,
      });
    },
  },
};
</script>

<style scoped>
.settings {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #e8e8e8;
}

.form-control-small {
  width: 4rem;
  height: auto;
  padding: 0.375rem;
}
</style>
