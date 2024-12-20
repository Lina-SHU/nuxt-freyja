export const useAPI = (url,options) => {
  const { $swal } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  return useFetch(url, {
    baseURL: runtimeConfig.public.apiUrl,
    transform: (response) => {
      const { result } = response;
      return result;
    },
    ...options,
    async onRequest({ request, options }) {
      options.headers.set('Authorization', useCookie('auth').value);
    },
    async onResponseError({ request, response, options }) {
      const { message } = response._data;
      $swal.fire({
        position: "center",
        icon: 'error',
        title: message
      });
      if (response.status === 403) {
        await navigateTo('/account/login');
      }
    }
  })
}