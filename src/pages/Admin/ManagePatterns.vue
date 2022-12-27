<template>
  <div class="container">
    <input type="file" class="form-control mb-2" @change="onFileSelected" />
    <div v-if="fileContent != null">
      <label for="file-name">File name:</label>
      <input
        type="text"
        id="file-name"
        class="form-control mb-2"
        v-model="fileName"
      />
      <div class="row text-start">
        <label class="col-12 fw-bold fs-4 text-center">Tags</label>
        <div class="col-3">
          <label class="fw-bold fs-5">Seasons</label>
          <div class="form-check" v-for="tag in seasons" :key="tag">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              :id="`tag-${tag.replaceAll(' ', '-')}`"
              :checked="tags.includes(tag)"
              @click="toggleTag(tag)"
            />
            <label
              class="form-check-label"
              :for="`tag-${tag.replaceAll(' ', '-')}`"
            >
              {{ tag }}
            </label>
          </div>
        </div>
        <div class="col-3">
          <label class="fw-bold fs-5">Holidays</label>
          <div class="form-check" v-for="tag in holidays" :key="tag">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              :id="`tag-${tag.replaceAll(' ', '-')}`"
              :checked="tags.includes(tag)"
              @click="toggleTag(tag)"
            />
            <label
              class="form-check-label"
              :for="`tag-${tag.replaceAll(' ', '-')}`"
            >
              {{ tag }}
            </label>
          </div>
        </div>
        <div class="col-3">
          <label class="fw-bold fs-5">Events</label>
          <div class="form-check" v-for="tag in events" :key="tag">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              :id="`tag-${tag.replaceAll(' ', '-')}`"
              :checked="tags.includes(tag)"
              @click="toggleTag(tag)"
            />
            <label
              class="form-check-label"
              :for="`tag-${tag.replaceAll(' ', '-')}`"
            >
              {{ tag }}
            </label>
          </div>
        </div>
        <div class="col-3">
          <label class="fw-bold fs-5">Categories</label>
          <div class="form-check" v-for="tag in categories" :key="tag">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              :id="`tag-${tag.replaceAll(' ', '-')}`"
              :checked="tags.includes(tag)"
              @click="toggleTag(tag)"
            />
            <label
              class="form-check-label"
              :for="`tag-${tag.replaceAll(' ', '-')}`"
            >
              {{ tag }}
            </label>
          </div>
        </div>
      </div>
      <div
        :style="
          isPattern
            ? 'width: 174px; height: 290px'
            : `width: ${dimensions.width || 174}px; height: ${
                dimensions.height || 290
              }px`
        "
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
      <div>TODO: name (what if duplicates?), tags</div>
      <button class="btn btn-outline-primary" @click="onUpload">Upload</button>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  doc,
  updateDoc,
  // getDocs,
  // collection,
  // setDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      url: null,
      selectedFile: null,
      fileContent: null,
      fileName: null,
      isPattern: false,
      colors: {},
      dimensions: {
        width: null,
        height: null,
      },
      tags: [],
      seasons: ["winter", "spring", "summer", "fall"],
      holidays: [
        "new year",
        "valentine",
        "st patrick",
        "easter",
        "memorial",
        "independence",
        "labor",
        "thanksgiving",
        "christmas",
      ],
      events: ["birthday", "wedding", "doctor"],
      categories: [
        "food",
        "chore",
        "school",
        "games",
        "sports",
        "exercise",
        "travel",
        "hobbies",
        "pets",
        "weather",
      ],
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

      const width = this.fileContent.match(/width="(.*)mm"/)[1];
      const height = this.fileContent.match(/height="(.*)mm"/)[1];
      this.setDimensions({
        width: Math.round(parseFloat(width)),
        height: Math.round(parseFloat(height)),
      });
    },
  },
  computed: {
    processedFileContent() {
      if (this.selectedFile && this.fileContent) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences
        const width = this.fileContent.match(/width="(.*)mm"/)[1];
        const height = this.fileContent.match(/height="(.*)mm"/)[1];

        if (this.isPattern) {
          const patternName = this.selectedFile.name
            .replace(".svg", "")
            .replace(" ", "-");

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

          pattern = pattern.replace(`width="${width}mm"`, `width="100%"`);
          pattern = pattern.replace(`height="${height}mm"`, `height="100%"`);

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
      this.tags = [];
      this.selectedFile = event.target.files[0];

      // only svg files allowed
      if (!/\.svg$/i.test(this.selectedFile.name)) {
        // display message
        this.selectedFile = null;
        return;
      }

      this.url = URL.createObjectURL(this.selectedFile);

      const reader = new FileReader();
      reader.onload = (res) => {
        this.fileContent = res.target.result;
      };
      reader.onerror = (err) => console.log(err);
      reader.readAsText(this.selectedFile);

      // if file name contains "pattern", pre-select pattern
      this.isPattern = /pattern/i.test(this.selectedFile.name);
      // remove "pattern" from name, remove .svg from end of name
      let fileName = this.selectedFile.name
        .toLowerCase()
        .replace("pattern", "")
        .replace(/\.svg$/, "");
      // trim whitespace from name, remove double spaces within name
      this.fileName = fileName
        .split(/[\s-]+/)
        .filter((word) => word != "")
        .join("-");

      // extract dimensions from image
    },
    setDimensions(dimensions) {
      this.dimensions = { ...dimensions };
    },
    toggleTag(tag) {
      const index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
      } else {
        this.tags.push(tag);
      }
    },
    async onUpload() {
      // https://firebase.google.com/docs/storage/web/upload-files
      const storageRef = ref(storage, `stickers/${this.fileName}.svg`);
      // const storageRef = ref(storage, `stickers/${this.selectedFile.name}`);

      const metadata = {
        cacheControl: "max-age=604800",
      };

      await uploadBytes(
        storageRef,
        new Blob([this.processedFileContent], { type: "image/svg+xml" }),
        metadata
      );

      let stickerProps = {};
      if (this.tags.length > 0) {
        stickerProps.tags = this.tags;
      }

      if (!this.isPattern) {
        stickerProps.ratio = this.dimensions.height / this.dimensions.width;
      }

      let newValue = {};
      newValue[this.fileName] = stickerProps;
      await updateDoc(doc(db, "stickers", "svg"), newValue);
    },
  },
};
</script>
