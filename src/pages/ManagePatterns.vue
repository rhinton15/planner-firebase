<template>
  <div>
    <input type="file" @change="onFileSelected" />
    <div>
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
        v-model="isPattern"
      />
      <label class="form-check-label p-1" for="flexCheckDefault">
        Pattern
      </label>
    </div>
    <div
      :style="isPattern ? 'width: 174px; height: 290px' : ''"
      class="m-auto"
      v-html="processedFileContent"
    ></div>
    <div class="p-2">
      <input
        v-for="index in Object.keys(colors).length"
        :key="index"
        type="color"
        :id="'color' + index"
        class="form-control form-control-color m-auto d-inline-block"
        :name="'color' + index"
        :value="Object.values(colors)[index - 1]"
        @change="
          changeColor(Object.keys(colors)[index - 1], $event.target.value)
        "
      />
    </div>
    <div>TODO: name (what if duplicates?), tags</div>
    <button class="btn btn-outline-primary" @click="onUpload">Upload</button>
  </div>
</template>

<script>
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default {
  data() {
    return {
      url: null,
      selectedFile: null,
      fileContent: null,
      isPattern: false,
      colors: {},
    };
  },
  watch: {
    fileContent(newValue) {
      const pattern = newValue.match(/<g[\s\S]*?>([\s\S]*?)<\/g>/)[1];

      const regexpHex = /#[0-9A-Fa-f]{6}/g;
      // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
      const colors = [...pattern.matchAll(regexpHex)]
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      this.colors = {};
      colors.forEach((color) => (this.colors[color] = color));
    },
  },
  computed: {
    processedFileContent() {
      if (this.selectedFile && this.fileContent) {
        if (this.isPattern) {
          const patternName = this.selectedFile.name.replace(".svg", "");

          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences
          const width = this.fileContent.match(/width="(.*)mm"/)[1];
          const height = this.fileContent.match(/height="(.*)mm"/)[1];
          // https://stackoverflow.com/questions/1979884/how-to-use-javascript-regex-over-multiple-lines
          let pattern = this.fileContent.match(/<g[\s\S]*?>([\s\S]*?)<\/g>/)[1];

          Object.keys(this.colors).forEach(
            (color) => (pattern = pattern.replaceAll(color, this.colors[color]))
          );

          const newSvg = `
<svg width="100%" height="100%">
  <pattern
    id="pattern-${patternName}"
    x="0"
    y="0"
    width="${width}"
    height="${height}"
    patternUnits="userSpaceOnUse"
  >
    ${pattern}
  </pattern>

  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    fill="url(#pattern-${patternName})"
  ></rect>
</svg>
          `;

          return newSvg;
        } else {
          let pattern = this.fileContent.match(
            /<svg[\s\S]*?>([\s\S]*?)<\/svg>/
          )[0];

          Object.keys(this.colors).forEach(
            (color) => (pattern = pattern.replaceAll(color, this.colors[color]))
          );

          return pattern;
        }
      }

      return this.fileContent;
    },
  },
  methods: {
    changeColor(key, newValue) {
      this.colors[key] = newValue;
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);

      const reader = new FileReader();
      reader.onload = (res) => {
        this.fileContent = res.target.result;
      };
      reader.onerror = (err) => console.log(err);
      reader.readAsText(this.selectedFile);
    },
    async onUpload() {
      // https://firebase.google.com/docs/storage/web/upload-files
      const storageRef = ref(storage, `stickers/${this.selectedFile.name}`);

      const metadata = {
        cacheControl: "max-age=604800",
      };

      uploadBytes(
        storageRef,
        new Blob([this.processedFileContent], { type: "image/svg+xml" }),
        metadata
      ).then(() => {
        console.log("Uploaded a blob or file!");
      });
    },
  },
};
</script>
