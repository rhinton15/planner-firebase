<template>
  <!-- <vueper-slides
    class="no-shadow w-100"
    :visible-slides="5"
    :gap="3"
    :duration="4000"
    :slide-ratio="1 / 4"
    :dragging-distance="200"
    :breakpoints="breakpoints"
    fixed-height="150px"
    autoplay
  >
    <vueper-slide v-for="slide in slides" :key="slide.id" :image="slide.url" />
  </vueper-slides> -->
  <!-- :style="{
        backgroundImage: 'url(' + require('@/assets/tutorial.jpg') + ')',
      }" -->
  <!-- slide-multiple -->
  <!-- :image="slide.image" -->
  <!-- :content="slide.content" -->
  <!-- <vueper-slide v-for="(slide, i) in slides" -->
  <!-- :style="'background-color: ' + colors[i % 4]"  -->
  <!-- <slick ref="slick" :options="slickOptions">
    <a href="http://placehold.it/2000x1000"
      ><img src="http://placehold.it/2000x1000" alt=""
    /></a>
    <a href="http://placehold.it/2000x1000"
      ><img src="http://placehold.it/2000x1000" alt=""
    /></a>
    <a href="http://placehold.it/2000x1000"
      ><img src="http://placehold.it/2000x1000" alt=""
    /></a>
    <a href="http://placehold.it/2000x1000"
      ><img src="http://placehold.it/2000x1000" alt=""
    /></a>
    <a href="http://placehold.it/2000x1000"
      ><img src="http://placehold.it/2000x1000" alt=""
    /></a>
  </slick> -->
  <agile :responsive="responsive" ref="carousel" :key="slides.length" autoplay>
    <!-- <img :src="slide.url" /> -->
    <!-- {{ slide.id }} -->
    <div class="slide agile__slide" v-for="slide in slides" :key="slide.id">
      <img :src="slide.url" class="w-100" />
    </div>
    <!-- <div class="slide">
      <img src="@/assets/tutorial.jpg" class="w-100" />
    </div>
    <div class="slide">
      <img src="@/assets/tutorial.jpg" class="w-100" />
    </div>
    <div class="slide">
      <img src="@/assets/tutorial.jpg" class="w-100" />
    </div> -->
    <template #prevButton>
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </template>
    <template #nextButton>
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </template>
  </agile>
</template>

<script>
// import Slick from "vue-slick";
// import { VueperSlides, VueperSlide } from "vueperslides";
// import "vueperslides/dist/vueperslides.css";

import { storage } from "../firebase";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { VueAgile } from "vue-agile";

export default {
  components: {
    agile: VueAgile,
  },
  //   components: { VueperSlides, VueperSlide },
  //   components: { Slick },
  data() {
    return {
      slides: [],
      breakpoints: {
        576: { visibleSlides: 1, slideMultiple: false },
        768: { visibleSlides: 2, slideMultiple: false },
        992: { visibleSlides: 3, slideMultiple: false },
        1200: { visibleSlides: 4, slideMultiple: false },
      },
      slickOptions: {
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      },
      html: `<div class="slide">
      <h3>Text</h3>
    </div>
    <div class="slide">
      <h3>Text</h3>
    </div>
    <div class="slide">
      <h3>Text</h3>
    </div>`,
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
      //     {
      //       id: 1,
      //       title: "abc",
      //       image: "~@/assets/tutorial.jpg",
      //       //   content: '<img style="width: 100px" src="img/tutorial.jpg" alt="" />',
      //     },
      //     {
      //       id: 2,
      //       title: "def",
      //       content: '<img class="w-100" src="@/assets/tutorial.jpg" alt="" />',
      //     },
      //     {
      //       id: 3,
      //       title: "ghi",
      //       content: '<img class="w-100" src="@/assets/tutorial.jpg" alt="" />',
      //     },
      //     {
      //       id: 4,
      //       title: "jkl",
      //       content: '<img class="w-100" src="@/assets/tutorial.jpg" alt="" />',
      //     },
      //   ],
    };
  },
  //   methods: {
  //     next() {
  //       this.$refs.slick.next();
  //     },

  //     prev() {
  //       this.$refs.slick.prev();
  //     },

  //     reInit() {
  //       // Helpful if you have to deal with v-for to update dynamic lists
  //       this.$nextTick(() => {
  //         this.$refs.slick.reSlick();
  //       });
  //     },
  //   },
  async mounted() {
    let { items } = await listAll(
      ref(storage, "templates/Li3JdUOXBLX26le7nQA7RlXKYWq1")
    );
    items.forEach(async (item) => {
      this.slides.push({
        id: item.name,
        url: await getDownloadURL(item),
      });
    });
    await this.$nextTick();
    this.$refs.carousel.reload();
    console.log("reload");
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
