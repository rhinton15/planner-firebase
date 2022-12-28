<template>
  <!-- https://forum.vuejs.org/t/how-do-i-make-an-html-tag-inside-a-data-string-render-as-an-html-tag/13074 -->
  <div
    class="h-100 w-100"
    @click="click"
    :style="`background-image: url(&quot;data:image/svg+xml,${svgContentFormatted}&quot;)`"
  ></div>
</template>

<script>
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default {
  props: ["scale", "rotation", "colors", "name", "width", "height"],
  emits: ["click"],
  data() {
    return {
      useColors: [],
      //   https://stackoverflow.com/questions/3830244/how-to-get-the-current-date-or-and-time-in-seconds
      id: new Date().getTime(),
      svgContent: "",
      svgText:
        "<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(20)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M40 45a5 5 0 110-10 5 5 0 010 10zM0 45a5 5 0 110-10 5 5 0 010 10zM0 5A5 5 0 110-5 5 5 0 010 5zm40 0a5 5 0 110-10 5 5 0 010 10z'  stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/><path d='M20 25a5 5 0 110-10 5 5 0 010 10z'  stroke-width='1' stroke='hsla(339.6,82.2%,51.6%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>",
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
        `<pattern patternTransform='scale(${2 ** (this.scale || 0)}) rotate(${
          this.rotation || 0
        })'`
      );

      svgText = svgText.replace(
        "<svg",
        "<svg xmlns='http://www.w3.org/2000/svg'"
      );

      return svgText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replaceAll("#", "%23")
        .replaceAll('"', "'");
    },
  },
  methods: {
    click() {
      this.$emit("click", this.useColors);
    },
  },
};
</script>
