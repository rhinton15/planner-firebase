<template>
  <agile :responsive="responsive" :key="slides.length" autoplay>
    <div class="slide agile__slide" v-for="slide in slides" :key="slide.id">
      <img :src="slide.url" class="w-100 px-2" />
    </div>
    <template #prevButton>
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </template>
    <template #nextButton>
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </template>
  </agile>
</template>

<script>
import { VueAgile } from "vue-agile";

import { storage } from "../firebase";
import { getDownloadURL, ref, listAll } from "firebase/storage";

export default {
  components: {
    agile: VueAgile,
  },
  data() {
    return {
      slides: [],
      responsive: [
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5,
          },
        },
      ],
    };
  },
  async mounted() {
    let { items } = await listAll(
      ref(storage, "templates/EcNkT67eGhOH2IAgMb9RZN2EEj03")
    );
    items.forEach(async (item) => {
      this.slides.push({
        id: item.name,
        url: await getDownloadURL(item),
      });
    });
  },
};
</script>

<style>
.agile__nav-button {
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 24px;
  transition-duration: 0.3s;
}
.agile__nav-button:hover {
  color: #888;
}

.agile__dot {
  margin: 0 10px;
}
.agile__dot button {
  background-color: #eee;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: block;
  height: 10px;
  font-size: 0;
  line-height: 0;
  margin: 0;
  padding: 0;
  transition-duration: 0.3s;
  width: 10px;
}
.agile__dot--current button,
.agile__dot:hover button {
  background-color: #888;
}
</style>
