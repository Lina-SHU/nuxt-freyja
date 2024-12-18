export const useAPI = (url,options) => {
  const { $swal } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  return useFetch(url, {
    baseURL: runtimeConfig.public.apiBase,
    transform: (response) => {
      const { result } = response;
      return result;
    },
    options: {
      ...options,
      headers: useRequestHeaders(['auth'])
    },
    async onRequest({ request, options }) {
      
    },
    async onResponse({ request, response, options }) {
      console.log('[fetch response]')
    },
    async onResponseError({ request, response, options }) {
      const { message } = response._data;
      $swal.fire({
        position: "center",
        icon: 'error',
        title: message
      });
      if (response.status === 403) {
        await nuxtApp.runWithContext(() => navigateTo('/account/login'))
      }
    }
  })
}