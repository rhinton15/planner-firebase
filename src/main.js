import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import BaseModal from "./components/BaseModal";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faUpDownLeftRight,
  faLeftRight,
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faAngleUp,
  faAnglesUp,
  faAngleDown,
  faAnglesDown,
  faCopy,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faBold,
  faFloppyDisk,
  faSpinner,
  faCheck,
  faExclamation,
  faCircleInfo,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

import { faCircleCheck, faCircle } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(
  faUpDownLeftRight,
  faLeftRight,
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faAngleUp,
  faAnglesUp,
  faAngleDown,
  faAnglesDown,
  faCopy,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faBold,
  faFloppyDisk,
  faSpinner,
  faCheck,
  faExclamation,
  faCircleCheck,
  faCircle,
  faCircleInfo,
  faCalendarDays
);

// don't load app until firebase is initialized
// https://www.thisdot.co/blog/firebase-for-user-authentication-in-vue-js
let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.component("base-modal", BaseModal);
    app.component("font-awesome-icon", FontAwesomeIcon);
    app.mount("#app");
  }
});
