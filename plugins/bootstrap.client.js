import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
const { Modal } = bootstrap;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('bootstrap', bootstrap);

  return {
    provide: {
      showModal: (element, options) => new Modal(element, options),
    }
  }
}); 