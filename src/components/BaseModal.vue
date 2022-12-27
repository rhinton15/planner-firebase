<template>
  <div>
    <div v-if="open" class="backdrop" @click="$emit('close')"></div>
    <transition name="modal">
      <dialog open v-if="open">
        <div class="position-absolute top-0 end-0 p-3" style="z-index: 10">
          <button
            type="button"
            class="btn-close bg-white"
            style="z-index: 10; border-radius: 12px"
            aria-label="Close"
            @click="$emit('close')"
          ></button>
        </div>
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
  z-index: 1040;
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
  z-index: 1050;
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
</style>
