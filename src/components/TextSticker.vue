<template>
  <!-- <sticker
      :id="text"
      v-for="text in texts"
      :key="text"
      v-model="text.position"
    >
      <textarea
        :style="{
          fontFamily: 'Amatic SC',
          fontWeight: 700,
          resize: 'none',
          width: text.width + 'px',
        }"
        class="text-center fs-1 border-0 bg-transparent textwhite overflow-hidden"
        v-model="text.text"
        @input="auto_grow($event.target)"
      ></textarea>
    </sticker> -->
  <p>temp</p>
</template>

<script>
import Sticker from "../components/Sticker.vue";

export default {
  components: { Sticker },
};
</script>
