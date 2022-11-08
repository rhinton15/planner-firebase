<template>
  <div>
    <div v-if="open" class="backdrop" @click="$emit('close')"></div>
    <transition name="modal">
      <dialog open v-if="open">
        <slot></slot>
      </dialog>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["open"],
  emits: ["close"],
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}

dialog {
  width: 96vw;
  left: 2vw;
  position: fixed;
  top: 2vh;
  height: 96vh;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: none;
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (min-width: 500px) {
  dialog {
    /* width: 96vw;
    left: 2vw; */
    /* width: 30rem;
    left: calc(50% - 15rem); */
    /* width: 50rem;
    left: calc(50% - 25rem); */
  }
}
</style>
