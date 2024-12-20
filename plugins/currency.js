export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('currency', {
        mounted(el, binding) {
            el.innerText = binding.value.toLocaleString('en-US'); 
        }
    })
});
