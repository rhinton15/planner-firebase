<template>
  <!-- https://forum.vuejs.org/t/how-do-i-make-an-html-tag-inside-a-data-string-render-as-an-html-tag/13074 -->
  <div class="h-100 w-100" v-html="svgContentFormatted" @click="click"></div>
</template>

<script>
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default {
  props: ["scale", "colors", "name", "width", "height"],
  emits: ["click"],
  data() {
    return {
      useColors: [],
      //   https://stackoverflow.com/questions/3830244/how-to-get-the-current-date-or-and-time-in-seconds
      id: new Date().getTime(),
      svgContent: "",
    };
  },
  async created() {
    var url = await getDownloadURL(ref(storage, `stickers/${this.name}.svg`));
    var response = await fetch(url);
    // https://stackoverflow.com/questions/63633111/how-do-i-read-and-convert-a-local-svg-file-into-text
    let svgText = await response.text();

    const regexpHex = /#[0-9A-Fa-f]{6}/g;
    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    const colors = [...svgText.matchAll(regexpHex)]
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index);

    this.useColors = this.colors || colors;

    for (var i = 0; i < colors.length; i++) {
      svgText = svgText.replaceAll(colors[i], "colors[" + i + "]");
    }

    const regexpId = /#[0-9A-Za-z\\-]*/g;
    const ids = [...svgText.matchAll(regexpId)]
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index);

    for (var j = 0; j < ids.length; j++) {
      svgText = svgText.replaceAll(
        ids[j].substring(1),
        ids[j].substring(1) + "-" + this.id
      );
    }

    this.svgContent = svgText;
  },
  computed: {
    svgContentFormatted() {
      let svgText = this.svgContent;
      for (var i = 0; i < this.useColors.length; i++) {
        svgText = svgText.replaceAll("colors[" + i + "]", this.useColors[i]);
      }

      svgText = svgText.replace(
        "<pattern",
        `<pattern style='transform: scale(${2 ** (this.scale || 0)})'`
      );

      if (this.width) {
        svgText = svgText.replace('width="100%"', `width="${this.width}px"`);
      }
      if (this.height) {
        svgText = svgText.replace('height="100%"', `height="${this.height}px"`);
      }

      return svgText;
    },
  },
  methods: {
    click() {
      this.$emit("click", this.useColors);
    },
  },
};
</script>
